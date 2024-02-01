import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-info-team',
  templateUrl: './info-team.component.html',
  styleUrl: './info-team.component.scss'
})
export class InfoTeamComponent {
  breadCrumbItems!: Array<{}>;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Info' },
      { label: 'Team', active: true }
    ];
  }

}
