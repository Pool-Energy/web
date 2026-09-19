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
  blockchainHeight: number = 0;
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
      this.blockchainHeight = data['blockchain_height'];
      this.blockchainShare = this.getBlockchainShare(data);
      this.pool_wallets = data['pool_wallets'];
      this.pool_nodes = data['pool_nodes'];
    });

    this.dataService.connectPoolStatus();
    this.dataService.poolStatusLive$.subscribe((data: any) => {
      this.blockchainHeight = data['blockchain_height'];
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

}
