import { Component } from '@angular/core';

@Component({
    selector: 'app-info-faq',
    templateUrl: './info-faq.component.html',
    styleUrl: './info-faq.component.scss',
    standalone: false
})

export class InfoFaqComponent {
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Info', link: '/' },
      { label: 'FAQ', active: true }
    ];
  }

}
