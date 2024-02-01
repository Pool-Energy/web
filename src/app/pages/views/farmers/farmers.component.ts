import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-farmers',
  templateUrl: './farmers.component.html',
  styleUrl: './farmers.component.scss'
})
export class FarmersComponent {
  breadCrumbItems!: Array<{}>;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Farmers', active: true }
    ];
  }

}
