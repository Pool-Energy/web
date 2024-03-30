import { Component } from '@angular/core';

@Component({
  selector: 'app-info-fee',
  templateUrl: './info-fee.component.html',
  styleUrl: './info-fee.component.scss'
})

export class InfoFeeComponent {
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Info' },
      { label: 'Fee', active: true }
    ];
  }

}
