import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-info-team',
  templateUrl: './info-team.component.html',
  styleUrl: './info-team.component.scss'
})

export class InfoTeamComponent {
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Info' },
      { label: 'Team', active: true }
    ];
  }

}
