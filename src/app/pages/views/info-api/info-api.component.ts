import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-info-api',
  templateUrl: './info-api.component.html',
  styleUrl: './info-api.component.scss'
})

export class InfoApiComponent {
  breadCrumbItems!: Array<{}>;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Info' },
      { label: 'Api', active: true }
    ];
  }

}
