import { Component } from '@angular/core';

@Component({
  selector: 'app-info-api',
  templateUrl: './info-api.component.html',
  styleUrl: './info-api.component.scss'
})

export class InfoApiComponent {
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Info' },
      { label: 'Api', active: true }
    ];
  }

}
