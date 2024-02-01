import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrl: './reward.component.scss'
})

export class RewardComponent {
  breadCrumbItems!: Array<{}>;

  reward_id: any = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(data => {
      this.reward_id = data.get('id');
      this.breadCrumbItems = [
        { label: 'Rewards' },
        { label: this.reward_id, active: true }
      ];
    });
  }

}
