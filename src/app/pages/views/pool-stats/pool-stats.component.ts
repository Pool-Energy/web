import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-pool-stats',
  templateUrl: './pool-stats.component.html',
  styleUrl: './pool-stats.component.scss'
})
export class PoolStatsComponent {
  breadCrumbItems!: Array<{}>;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pool' },
      { label: 'Stats', active: true }
    ];
  }

}
