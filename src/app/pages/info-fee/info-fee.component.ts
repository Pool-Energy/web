import { Component } from '@angular/core';

@Component({
    selector: 'app-info-fee',
    templateUrl: './info-fee.component.html',
    styleUrl: './info-fee.component.scss',
    standalone: false
})

export class InfoFeeComponent {
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'BREADCRUMBS.INFO', link: '/' },
      { label: 'BREADCRUMBS.FEE', active: true }
    ];
  }

}
