import { Component } from '@angular/core';

import { DataService } from 'src/app/data.service';

const MAX_ROWS = 300;

@Component({
    selector: 'app-partials',
    templateUrl: './partials.component.html',
    styleUrl: './partials.component.scss',
    standalone: false
})

export class PartialsComponent {
  breadCrumbItems!: Array<{}>;

  // Live, capped, most-recent-first buffer of partials from ALL farmers.
  partials: Array<any> = new Array();

  paused: boolean = false;
  showFailedOnly: boolean = false;
  totalReceived: number = 0;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/' },
      { label: 'Partials', active: true }
    ];

    this.dataService.connectPartialsLive();
    this.dataService.partialsLive$.subscribe((partial: any) => {
      this.totalReceived++;
      if(this.paused) { return; }
      this.partials.unshift(partial);
      if(this.partials.length > MAX_ROWS) {
        this.partials.length = MAX_ROWS;
      }
    });
  }

  ngOnDestroy(): void {
    this.dataService.disconnectPartialsLive();
  }

  togglePause() {
    this.paused = !this.paused;
  }

  clear() {
    this.partials = [];
  }

  get filteredPartials() {
    if(!this.showFailedOnly) { return this.partials; }
    return this.partials.filter((p) => !!p.error);
  }

}
