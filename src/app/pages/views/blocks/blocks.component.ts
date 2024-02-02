import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrl: './blocks.component.scss'
})

export class BlocksComponent {
  breadCrumbItems!: Array<{}>;

  estimate_win: any = 0;
  current_effort: any = 0;

  _blocks$: Subject<any[]> = new Subject<any[]>();
  blocks$: Observable<any[]>;
  blocksCollectionSize: number = 0;
  blocksPage: number = 1;
  blocksPageSize: number = 10;
  lastBlock: any;

  constructor(
    private dataService: DataService
  ) {
    this.blocks$ = this._blocks$.asObservable();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Blocks', active: true }
    ];

    this.dataService.getStats().subscribe((data: any) => {
      this.estimate_win = this.secondsToHuman(data['estimate_win'] * 60);
      this.current_effort = (data['time_since_last_win'] / (data['estimate_win'] * 60)) * 180;
    })

    this.dataService.getBlocks({
      limit: this.blocksPageSize
    }).subscribe(this.handleBlocks.bind(this));
  }

  private handleBlocks(data: any) {
    this.blocksCollectionSize = data['count'];
    this._blocks$.next(data['results']);
    this.lastBlock = data['results'][0];
  }

  refreshBlocks() {
    this.dataService.getBlocks({
      offset: (this.blocksPage - 1) * this.blocksPageSize,
      limit: this.blocksPageSize,
    }).subscribe(this.handleBlocks.bind(this));
  }

  private secondsToHuman(d: number) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var hDisplay = h > 0 ? h + "h" : "";
    var mDisplay = m > 0 ? m + "m" : "";
    return hDisplay + " " + mDisplay
  }

}
