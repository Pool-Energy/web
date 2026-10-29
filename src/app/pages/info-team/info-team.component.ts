import { Component } from '@angular/core';

@Component({
    selector: 'app-info-team',
    templateUrl: './info-team.component.html',
    styleUrl: './info-team.component.scss',
    standalone: false
})

export class InfoTeamComponent {
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'BREADCRUMBS.INFO', link: '/' },
      { label: 'BREADCRUMBS.TEAM', active: true }
    ];
  }

}
