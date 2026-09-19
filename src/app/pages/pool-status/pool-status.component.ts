import { Component } from '@angular/core';

import { DataService } from 'src/app/data.service';

@Component({
    selector: 'app-pool-status',
    templateUrl: './pool-status.component.html',
    styleUrl: './pool-status.component.scss',
    standalone: false
})

export class PoolStatusComponent {
  breadCrumbItems!: Array<{}>;

  // pool
  blockchainShare: number = 0;

  // wallets
  pool_wallets: Array<any> = new Array();

  // nodes
  pool_nodes: Array<any> = new Array();

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/'},
      { label: 'Pool' },
      { label: 'Status', active: true }
    ];

    this.dataService.getStats().subscribe((data: any) => {
      this.blockchainShare = this.getBlockchainShare(data);
      this.pool_wallets = data['pool_wallets'];
      this.pool_nodes = data['pool_nodes'];
    });

    this.dataService.connectPoolStatus();
    this.dataService.poolStatusLive$.subscribe((data: any) => {
      this.pool_wallets = data['wallets'];
      this.pool_nodes = data['nodes'];
      // blockchainShare needs `pool_space` (not part of the live payload,
      // computed server-side in /stats); left untouched until next full reload.
    });
  }

  ngOnDestroy(): void {
    this.dataService.disconnectPoolStatus();
  }

  // blockchain
  getBlockchainShare(data: any) {
    return data['pool_space'] * 100 / data['blockchain_space'];
  }

  /**
   * Real blockchain (network) height, derived from all nodes rather than
   * just the pool's currently-selected primary node: a node that is still
   * syncing reports its own (stale) `peak_height`, but its `sync_tip_height`
   * reflects the target height seen from its peers - so the max across both
   * fields, across all available nodes, is a better approximation of the
   * actual chain tip than any single node's peak.
   */
  get networkBlockchainHeight(): number {
    var height = 0;
    for(const node of this.pool_nodes) {
      if(!node.available) { continue; }
      if(node.peak_height && node.peak_height > height) { height = node.peak_height; }
      if(node.sync_tip_height && node.sync_tip_height > height) { height = node.sync_tip_height; }
    }
    return height;
  }

  /**
   * Overall pool node health, derived from the actual sync state of every
   * enabled node (instead of a hardcoded "Ok"):
   * - 'critical' if no enabled node is available+synced (matches the pool's
   *   own "No healthy node available" condition)
   * - 'degraded' if some, but not all, enabled nodes are synced
   * - 'healthy' if every enabled node is available and synced
   */
  get poolStatus(): 'healthy' | 'degraded' | 'critical' {
    const enabledNodes = this.pool_nodes.filter((n) => n.enabled);
    if(enabledNodes.length === 0) { return 'critical'; }
    const healthyNodes = enabledNodes.filter((n) => n.available && n.synced);
    if(healthyNodes.length === 0) { return 'critical'; }
    if(healthyNodes.length < enabledNodes.length) { return 'degraded'; }
    return 'healthy';
  }

}
