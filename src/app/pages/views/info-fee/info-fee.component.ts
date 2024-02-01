import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-info-fee',
  templateUrl: './info-fee.component.html',
  styleUrl: './info-fee.component.scss'
})
export class InfoFeeComponent {
  breadCrumbItems!: Array<{}>;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Info' },
      { label: 'Fee', active: true }
    ];
  }

}
