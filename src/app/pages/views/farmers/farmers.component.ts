import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-farmers',
  templateUrl: './farmers.component.html',
  styleUrl: './farmers.component.scss'
})
export class FarmersComponent {
  breadCrumbItems!: Array<{}>;

  current_effort: any = 0;
  total_active_farmers: any = 0;
  current_fee: any = 0;

  blockchain_halving_popup: boolean = false;
  blockchain_halving_block: number = 10091520;
  blockchain_halving_diff: number = 0;
  blockchain_halving_percent: number = 0;
  blockchain_halving_class: string = "info";
  blockchain_current_block: number = 0;

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
      { label: 'Home' },
      { label: 'Farmers', active: true }
    ];

    this.dataService.getStats().subscribe((data: any) => {
      this.current_effort = (data['time_since_last_win'] / (data['estimate_win'] * 60)) * 180;
      this.total_active_farmers = data['farmers_active'];
      this.current_fee = data['fee'] * 100;
      if (this.blockchain_halving_popup) {
        this.handleHalving(data['blockchain_height']);
      }
    })

    this.dataService.getLaunchers({
      limit: this.launchersPageSize,
      points_pplns__gt: 1
    }).subscribe(this.handleLaunchers.bind(this));
  }

  private handleHalving(block: number) {
    this.blockchain_current_block = block;
    this.blockchain_halving_diff = this.blockchain_current_block - this.blockchain_halving_block;
    this.blockchain_halving_percent = this.blockchain_current_block * 100 / this.blockchain_halving_block;
    if(this.blockchain_halving_percent >= 99.5) {
      this.blockchain_halving_class = "danger";
    } else if(this.blockchain_halving_percent >= 99) {
      this.blockchain_halving_class = "warning";
    } else {
      this.blockchain_halving_class = "info";
    }
  }

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
