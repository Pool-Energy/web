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

// Live activity chart: bucket partial events into 15-minute bars, kept for
// at least 12 hours. Only `valid`/`red` (stale+invalid)/`duplicate` can be
// backfilled from history (via the Postgres-backed REST API, which only
// ever stores *resolved* partials); `pending` ("to be validated") has no
// historical persistence anywhere (it's a transient live-only state), so
// its bars only start filling in from the moment this page connects.
const CHART_BUCKET_SECONDS = 15 * 60;
const CHART_HISTORY_HOURS = 24;
// Live events can arrive several times per second pool-wide; rebuilding the
// (up to ~96 bars) chart on every single one is expensive (category label
// formatting, ApexCharts update) and made the chart feel sluggish. Coalesce
// bursts of updates into at most one rebuild per this interval instead.
const CHART_REBUILD_THROTTLE_MS = 2000;

type FlashField = 'to_be_validated' | 'valid' | 'stale' | 'duplicate' | 'invalid' | 'blocks_found';
type TerminalStatus = 'valid' | 'stale' | 'duplicate' | 'invalid';
type ChartCategory = 'valid' | 'pending' | 'red' | 'duplicate';

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

interface ChartBucket {
  time: number;
  label: string;
  valid: number;
  pending: number;
  red: number;
  duplicate: number;
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

  // Live activity chart (see ChartBucket/CHART_* above).
  private chartBuckets: Map<number, ChartBucket> = new Map();
  activityChart: any = {};
  activityChartLegend: boolean = true;
  private lastChartCategoriesCount: number = -1;
  private chartRebuildScheduled: boolean = false;

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
        // Backfill of the last 15 minutes of partial activity (both
        // "to be validated" and already-resolved events, oldest first),
        // replayed in order so the SP rows/counters end up in the exact
        // same state as if this page had been connected the whole time.
        const events = msg['payload'] as Array<any>;
        this.totalReceived += events.length;
        events.forEach((partial: any) => this.handlePartial(partial));
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

    // Backfill the activity chart with resolved (valid/stale/duplicate/invalid)
    // partials from the last `CHART_HISTORY_HOURS` hours. "Pending" bars are
    // not backfillable (no historical persistence for that transient state)
    // and only start accumulating live from here on.
    this.dataService.getPartials('', undefined, CHART_HISTORY_HOURS / 24).subscribe((data: any) => {
      (data['results'] as Array<any>).forEach((partial: any) => {
        this.addToChart(partial.timestamp, this.classifyChartCategory(partial.error));
      });
      this.performChartRebuild();
    });

    this.sweepTimer = setInterval(() => { this.sweep(); this.performChartRebuild(); }, SWEEP_INTERVAL_MS);
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
      this.addToChart(partial.timestamp, 'pending');
      this.scheduleChartRebuild();
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
    this.addToChart(partial.timestamp, status === 'duplicate' ? 'duplicate' : (status === 'valid' ? 'valid' : 'red'));
    this.scheduleChartRebuild();
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

    const cutoff = now - CHART_HISTORY_HOURS * 3600;
    this.chartBuckets.forEach((bucket, time) => {
      if(time < cutoff) {
        this.chartBuckets.delete(time);
      }
    });
  }

  // activity chart
  private classifyChartCategory(error: string | null): ChartCategory {
    if(!error) { return 'valid'; }
    if(error === 'DOUBLE_SIGNAGE_POINT') { return 'duplicate'; }
    return 'red';
  }

  private addToChart(timestamp: number, category: ChartCategory) {
    const bucketTime = Math.floor(timestamp / CHART_BUCKET_SECONDS) * CHART_BUCKET_SECONDS;
    var bucket = this.chartBuckets.get(bucketTime);
    if(!bucket) {
      bucket = {
        time: bucketTime,
        label: new Date(bucketTime * 1000).toLocaleString(),
        valid: 0, pending: 0, red: 0, duplicate: 0,
      };
      this.chartBuckets.set(bucketTime, bucket);
    }
    bucket[category]++;
  }

  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if(newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if(color) {
          return color.replace(" ", "");
        } else {
          return newValue;
        }
      } else {
        var val = value.split(',');
        if(val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          return "rgba(" + rgbaColor + "," + val[1] + ")";
        } else {
          return newValue;
        }
      }
    });
  }

  // Coalesces bursts of live events into at most one chart rebuild per
  // `CHART_REBUILD_THROTTLE_MS` (see constant above), instead of rebuilding
  // (category label formatting + ApexCharts update) on every single event.
  private scheduleChartRebuild() {
    if(this.chartRebuildScheduled) { return; }
    this.chartRebuildScheduled = true;
    setTimeout(() => {
      this.chartRebuildScheduled = false;
      this.performChartRebuild();
    }, CHART_REBUILD_THROTTLE_MS);
  }

  private performChartRebuild() {
    const cutoff = (Date.now() / 1000) - CHART_HISTORY_HOURS * 3600;
    const buckets = Array.from(this.chartBuckets.values())
      .filter((b) => b.time >= cutoff)
      .sort((a, b) => a.time - b.time);

    const categories = buckets.map((b) => b.label);
    const series = [
      { name: 'Valid', data: buckets.map((b) => b.valid) },
      { name: 'To be validated', data: buckets.map((b) => b.pending) },
      { name: 'Invalid / reverted', data: buckets.map((b) => b.red) },
      { name: 'Duplicate', data: buckets.map((b) => b.duplicate) },
    ];

    // Only rebuild the full chart config (chart/xaxis/colors/...) when the
    // number of bars actually changes (a new 15-min bucket appears, or the
    // very first render) or when nothing has been rendered yet: reassigning
    // those nested objects forces ng-apexcharts to tear down and recreate
    // the whole chart. On every other update (the common case: values
    // changing within already-existing bars), only `series` is reassigned
    // (new array reference, everything else keeps the same object
    // reference) - ng-apexcharts detects that only `series` changed and
    // calls ApexCharts' native `updateSeries()` internally, which updates
    // just the changed bars instead of a full redraw.
    const structuralChange = categories.length !== this.lastChartCategoriesCount;
    this.lastChartCategoriesCount = categories.length;

    if(structuralChange || !this.activityChart.chart) {
      this.activityChart = {
        series: series,
        chart: {
          height: 300,
          type: 'bar',
          stacked: true,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: { horizontal: false },
        },
        legend: {
          show: this.activityChartLegend,
        },
        dataLabels: {
          enabled: false,
        },
        noData: {
          text: 'Loading...',
        },
        xaxis: {
          categories: categories,
          labels: { show: false },
        },
        yaxis: {
          min: 0,
        },
        colors: this.getChartColorsArray('["--vz-success","--vz-warning","--vz-danger","--vz-secondary"]'),
        tooltip: {
          x: { show: true },
        },
      };
    } else {
      this.activityChart.series = series;
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
