import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-info-faq',
  templateUrl: './info-faq.component.html',
  styleUrl: './info-faq.component.scss'
})

export class InfoFaqComponent {
  breadCrumbItems!: Array<{}>;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Info' },
      { label: 'FAQ', active: true }
    ];
  }

}
