import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-pool-status',
  templateUrl: './pool-status.component.html',
  styleUrl: './pool-status.component.scss'
})
export class PoolStatusComponent {
  breadCrumbItems!: Array<{}>;

  pool_wallets: Array<any> = new Array();

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pool' },
      { label: 'Status', active: true }
    ];

    this.dataService.getStats().subscribe((data: any) => {
      this.pool_wallets = data['pool_wallets'];
    })
  }

}
