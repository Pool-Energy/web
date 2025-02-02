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
  pool_message: Array<any> = new Array();
  current_effort: number = 0;
  average_effort: number = 0;
  total_active_farmers: any = 0;
  estimate_win: any | undefined;
  current_fee: any = 0;
  xch_current_price: number = 0;
  last_block: any = null;
  leaderboard: Array<any> = new Array();

  // chia fork
  chia_consensus_fork_enabled: boolean = true;
  chia_consensus_fork_block: number = 680000;
  chia_consensus_fork_diff: number = 0;
  chia_consensus_fork_percent: number = 0;
  chia_consensus_fork_class: string = "info";
  chia_consensus_fork_current_block: number | undefined;

  // launchers
  _launchers$: Subject<any[]> = new Subject<any[]>();
  launchers$: Observable<any[]>;
  launchersCollectionSize: number = 0;
  launchersPage: number = 1;
  launchersPageSize: number = 20;

  // blocks
  _blocks$: Subject<any[]> = new Subject<any[]>();
  blocks$: Observable<any[]>;

  constructor(
    private dataService: DataService
  ) {
    this.launchers$ = this._launchers$.asObservable();
    this.blocks$ = this._blocks$.asObservable();
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
      if(this.chia_consensus_fork_enabled) {
        this.handleChiaConsensusFork(data['blockchain_height']);
      }
    })

    this.dataService.getMessages().subscribe((data: any) => {
      this.pool_message = data;
    })

    this.dataService.getLaunchers({
      limit: this.launchersPageSize,
      points_pplns__gt: 1
    }).subscribe(this.handleLaunchers.bind(this));

    this.dataService.getBlocks({
      limit: 1,
    }).subscribe(this.handleBlocks.bind(this));
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

  // chia consensus fork
  private handleChiaConsensusFork(block: number) {
    this.chia_consensus_fork_current_block = block;
    this.chia_consensus_fork_diff = this.chia_consensus_fork_current_block - this.chia_consensus_fork_block;
    this.chia_consensus_fork_percent = this.chia_consensus_fork_current_block * 100 / this.chia_consensus_fork_block;
    if(this.chia_consensus_fork_percent >= 99.5) {
      this.chia_consensus_fork_class = "danger";
    } else if(this.chia_consensus_fork_percent >= 99) {
      this.chia_consensus_fork_class = "warning";
    } else {
      this.chia_consensus_fork_class = "info";
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

  // blocks
  private handleBlocks(data: any) {
    this.last_block = data['results'][0];
    this._blocks$.next(data['results']);
  }

  // message
  closeMessage(index: number) {
    this.pool_message.splice(index, 1);
  }

}
