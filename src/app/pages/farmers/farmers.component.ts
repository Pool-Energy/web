import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { humanizer } from 'humanize-duration';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-farmers',
  templateUrl: './farmers.component.html',
  styleUrl: './farmers.component.scss'
})

export class FarmersComponent {
  breadCrumbItems!: Array<{}>;

  pool_space: number = 0;
  current_effort: number = 0;
  average_effort: number = 0;
  total_active_farmers: any = 0;
  estimate_win: any | undefined;
  current_fee: any = 0;
  xch_current_price: number = 0;
  last_block: any = null;

  // block reward halving
  block_reward_halving_enabled: boolean = false;
  block_reward_halving_block: number = 10091520;
  block_reward_halving_diff: number = 0;
  block_reward_halving_percent: number = 0;
  block_reward_halving_class: string = "info";
  block_reward_halving_current_block: number | undefined;

  // plot filter halving
  plot_filter_halving_enabled: boolean = true;
  plot_filter_halving_block: number = 10542000;
  plot_filter_halving_diff: number = 0;
  plot_filter_halving_percent: number = 0;
  plot_filter_halving_class: string = "info";
  plot_filter_halving_current_block: number | undefined;

  leaderboard: Array<any> = new Array();

  _launchers$: Subject<any[]> = new Subject<any[]>();
  launchers$: Observable<any[]>;
  launchersCollectionSize: number = 0;
  launchersPage: number = 1;
  launchersPageSize: number = 10;

  constructor(
    private dataService: DataService
  ) {
    this.launchers$ = this._launchers$.asObservable();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/' },
      { label: 'Farmers', active: true }
    ];

    this.dataService.getStats().subscribe((data: any) => {
      this.pool_space = data['pool_space'];
      this.current_effort = (data['time_since_last_win'] / (data['estimate_win'] * 60)) * 180;
      this.average_effort = data['average_effort'];
      this.total_active_farmers = data['farmers_active'];
      this.estimate_win = data['estimate_win'] * 60;
      this.current_fee = data['fee'] * 100;
      this.xch_current_price = data['xch_current_price']['usd'];
      if(this.block_reward_halving_enabled) {
        this.handleBlockRewardHalving(data['blockchain_height']);
      }
      if(this.plot_filter_halving_enabled) {
        this.handlePlotFilterHalving(data['blockchain_height']);
      }
    })

    this.dataService.getLaunchers({
      limit: this.launchersPageSize,
      points_pplns__gt: 1
    }).subscribe(this.handleLaunchers.bind(this));
  }

  // common
  humanize(seconds: number) {
    var h = humanizer();
    return h(seconds, {
      language: "en",
      units: ["h", "m"],
      largest: 2
    });
  }

  // halving
  private handleBlockRewardHalving(block: number) {
    this.block_reward_halving_current_block = block;
    this.block_reward_halving_diff = this.block_reward_halving_current_block - this.block_reward_halving_block;
    this.block_reward_halving_percent = this.block_reward_halving_current_block * 100 / this.block_reward_halving_block;
    if(this.block_reward_halving_percent >= 99.5) {
      this.block_reward_halving_class = "danger";
    } else if(this.block_reward_halving_percent >= 99) {
      this.block_reward_halving_class = "warning";
    } else {
      this.block_reward_halving_class = "info";
    }
  }

  private handlePlotFilterHalving(block: number) {
    this.plot_filter_halving_current_block = block;
    this.plot_filter_halving_diff = this.plot_filter_halving_current_block - this.plot_filter_halving_block;
    this.plot_filter_halving_percent = this.plot_filter_halving_current_block * 100 / this.plot_filter_halving_block;
    if(this.plot_filter_halving_percent >= 99.5) {
      this.plot_filter_halving_class = "danger";
    } else if(this.plot_filter_halving_percent >= 99) {
      this.plot_filter_halving_class = "warning";
    } else {
      this.plot_filter_halving_class = "info";
    }
  }

  // launchers
  private handleLaunchers(data: any) {
    if(this.leaderboard.length == 0) {
      this.leaderboard = data['results'].slice(0, 3);
    }
    this.launchersCollectionSize = data['count'];
    this._launchers$.next(data['results']);
  }

  refreshLaunchers() {
    this.dataService.getLaunchers({
      offset: (this.launchersPage - 1) * this.launchersPageSize,
      limit: this.launchersPageSize,
      points_pplns__gt: 1
    }).subscribe(this.handleLaunchers.bind(this));
  }

}
