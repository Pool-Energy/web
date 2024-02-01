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

    this.dataService.getLaunchers({
      limit: this.launchersPageSize,
      points_pplns__gt: 1
    }).subscribe(this.handleLaunchers.bind(this));
  }

  private handleLaunchers(data: any) {
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
