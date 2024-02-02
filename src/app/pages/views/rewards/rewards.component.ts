import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.scss'
})

export class RewardsComponent {
  breadCrumbItems!: Array<{}>;

  rewardsTotalClaimed: any = 0;
  rewardsTotalDistributed: any = 0;
  rewardsTotalFee: any = 0;

  _rewards$: Subject<any[]> = new Subject<any[]>();
  rewards$: Observable<any[]>;
  rewardsCollectionSize: number = 0;
  rewardsPage: number = 1;
  rewardsPageSize: number = 10;

  constructor(
    private dataService: DataService
  ) {
    this.rewards$ = this._rewards$.asObservable();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Rewards', active: true }
    ];

    this.dataService.getStats().subscribe((data: any) => {
      this.rewardsTotalClaimed = data['rewards_amount'] / (10 ** 12);
      this.rewardsTotalDistributed = (data['rewards_amount'] / (10 ** 12)) - data['fee'];
      this.rewardsTotalFee = (data['rewards_amount'] * data['fee'] / 100) / (10 ** 12);
    })

    this.dataService.getRewards({
      limit: this.rewardsPageSize
    }).subscribe(this.handleRewards.bind(this));
  }

  private handleRewards(data: any) {
    this.rewardsCollectionSize = data['count'];
    this._rewards$.next(data['results']);
  }

  refreshRewards() {
    this.dataService.getRewards({
      offset: (this.rewardsPage - 1) * this.rewardsPageSize,
      limit: this.rewardsPageSize,
    }).subscribe(this.handleRewards.bind(this));
  }

}
