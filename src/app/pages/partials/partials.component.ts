import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataService } from 'src/app/data.service';

// Keep signage-point rows visible for 10 minutes: this comfortably covers
// the pool's `partial_confirmation_delay` (Phase 2 confirmation window,
// currently 300s/5min) plus margin, so a "to be validated" partial has time
// to resolve (valid/stale/duplicate/invalid) on its own row before it's
// evicted from the live view.
const RETENTION_MS = 10 * 60 * 1000;
const SWEEP_INTERVAL_MS = 30 * 1000;
const FLASH_MS = 500;

type FlashField = 'to_be_validated' | 'valid' | 'stale' | 'duplicate' | 'invalid' | 'blocks_found';
type TerminalStatus = 'valid' | 'stale' | 'duplicate' | 'invalid';

interface SPRow {
  sp_hash: string;
  end_of_sub_slot: boolean;
  first_timestamp: number;
  last_timestamp: number;
  to_be_validated: number;
  valid: number;
  stale: number;
  duplicate: number;
  invalid: number;
  blocks_found: number;
  blocks: Array<any>;
  flash: { [key in FlashField]?: boolean };
}

@Component({
    selector: 'app-partials',
    templateUrl: './partials.component.html',
    styleUrl: './partials.component.scss',
    standalone: false
})

export class PartialsComponent implements OnInit, OnDestroy {
  breadCrumbItems!: Array<{}>;

  // One row per signage point (sp_hash), most-recent-first.
  private rows: Map<string, SPRow> = new Map();
  // Tracks partials currently "to be validated" (partial_key -> sp_hash), so
  // their eventual resolution (valid/stale/duplicate/invalid) can move them
  // out of the `to_be_validated` bucket on the correct row without double
  // counting, instead of just incrementing counters independently.
  private pendingIndex: Map<string, string> = new Map();
  // Tracks the final status already recorded for a resolved partial
  // (partial_key -> {sp_hash, status}). This guards against a partial being
  // counted twice if, for any reason (e.g. a backend safety-net force-
  // resolving a partial that was actually still legitimately in-flight), two
  // resolution events arrive for the same partial: instead of incrementing
  // both buckets, the earlier one is corrected (decremented) in favor of the
  // latest, most authoritative status.
  private resolvedIndex: Map<string, { sp_hash: string, status: TerminalStatus }> = new Map();

  paused: boolean = false;
  totalReceived: number = 0;
  totalBlocks: number = 0;

  private sweepTimer: any;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/' },
      { label: 'Partials', active: true }
    ];

    this.dataService.connectPartialsLive();
    this.dataService.partialsLive$.subscribe((msg: any) => {
      if(msg['kind'] === 'partial_snapshot') {
        // Initial backfill of partials already "to be validated" when this
        // page connected (sent once, right after connecting).
        (msg['payload'] as Array<any>).forEach((partial: any) => this.handlePartial(partial));
        return;
      }
      if(this.paused) { return; }
      if(msg['kind'] === 'partial') {
        this.totalReceived++;
        this.handlePartial(msg['payload']);
      } else if(msg['kind'] === 'block') {
        this.totalBlocks++;
        this.handleBlock(msg['payload']);
      }
    });

    this.sweepTimer = setInterval(() => this.sweep(), SWEEP_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    this.dataService.disconnectPartialsLive();
    if(this.sweepTimer) {
      clearInterval(this.sweepTimer);
    }
  }

  private getOrCreateRow(sp_hash: string, end_of_sub_slot: boolean, timestamp: number): SPRow {
    var row = this.rows.get(sp_hash);
    if(!row) {
      row = {
        sp_hash: sp_hash,
        end_of_sub_slot: end_of_sub_slot,
        first_timestamp: timestamp,
        last_timestamp: timestamp,
        to_be_validated: 0,
        valid: 0,
        stale: 0,
        duplicate: 0,
        invalid: 0,
        blocks_found: 0,
        blocks: [],
        flash: {},
      };
      this.rows.set(sp_hash, row);
    }
    if(timestamp > row.last_timestamp) {
      row.last_timestamp = timestamp;
    }
    return row;
  }

  private flash(row: SPRow, field: FlashField) {
    row.flash[field] = true;
    setTimeout(() => { row.flash[field] = false; }, FLASH_MS);
  }

  private terminalStatus(status: string): TerminalStatus {
    if(status === 'valid' || status === 'stale' || status === 'duplicate') { return status; }
    return 'invalid';
  }

  private handlePartial(partial: any) {
    const row = this.getOrCreateRow(partial.sp_hash, partial.end_of_sub_slot, partial.timestamp);

    if(partial.status === 'pending') {
      row.to_be_validated++;
      this.flash(row, 'to_be_validated');
      this.pendingIndex.set(partial.partial_key, partial.sp_hash);
      return;
    }

    // Resolution of a previously-seen pending partial: move it out of the
    // `to_be_validated` bucket (on whichever row it was pending on - should
    // always be this same row, since sp_hash is stable for a given partial).
    const pendingSpHash = this.pendingIndex.get(partial.partial_key);
    if(pendingSpHash) {
      this.pendingIndex.delete(partial.partial_key);
      const pendingRow = this.rows.get(pendingSpHash);
      if(pendingRow && pendingRow.to_be_validated > 0) {
        pendingRow.to_be_validated--;
        this.flash(pendingRow, 'to_be_validated');
      }
    }

    const status = this.terminalStatus(partial.status);
    const previous = this.resolvedIndex.get(partial.partial_key);
    if(previous) {
      // Already resolved once (e.g. force-resolved as stale by the pool's
      // watchdog, and now the real, authoritative resolution arrives a bit
      // late): correct the earlier bucket instead of counting it twice.
      if(previous.status !== status) {
        const previousRow = this.rows.get(previous.sp_hash);
        if(previousRow && previousRow[previous.status] > 0) {
          previousRow[previous.status]--;
          this.flash(previousRow, previous.status);
        }
        row[status]++;
        this.flash(row, status);
        this.resolvedIndex.set(partial.partial_key, { sp_hash: partial.sp_hash, status });
      }
      return;
    }

    this.resolvedIndex.set(partial.partial_key, { sp_hash: partial.sp_hash, status });
    row[status]++;
    this.flash(row, status);
  }

  private handleBlock(block: any) {
    // Best-effort correlation: attach the block to the signage point row
    // whose timestamp is closest (no strict time window - there is no
    // direct technical link between a found block and a signage point today).
    if(this.rows.size === 0) { return; }
    var closest: SPRow | null = null;
    var closestDelta = Infinity;
    this.rows.forEach((row) => {
      const delta = Math.abs(row.last_timestamp - block.timestamp);
      if(delta < closestDelta) {
        closestDelta = delta;
        closest = row;
      }
    });
    if(closest) {
      (closest as SPRow).blocks_found++;
      this.flash(closest as SPRow, 'blocks_found');
      (closest as SPRow).blocks.push(block);
    }
  }

  private sweep() {
    const now = Date.now() / 1000;
    const evicted = new Set<string>();
    this.rows.forEach((row, sp_hash) => {
      if(row.to_be_validated > 0) { return; }
      if((now - row.last_timestamp) * 1000 > RETENTION_MS) {
        this.rows.delete(sp_hash);
        evicted.add(sp_hash);
      }
    });
    if(evicted.size > 0) {
      this.resolvedIndex.forEach((entry, partial_key) => {
        if(evicted.has(entry.sp_hash)) {
          this.resolvedIndex.delete(partial_key);
        }
      });
    }
  }

  get orderedRows(): SPRow[] {
    return Array.from(this.rows.values()).sort((a, b) => b.last_timestamp - a.last_timestamp);
  }

  togglePause() {
    this.paused = !this.paused;
  }

  clear() {
    this.rows.clear();
    this.pendingIndex.clear();
    this.resolvedIndex.clear();
    this.totalReceived = 0;
    this.totalBlocks = 0;
  }

}
