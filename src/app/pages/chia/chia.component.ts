import { Component } from '@angular/core';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-chia',
  templateUrl: './chia.component.html',
  styleUrl: './chia.component.scss'
})

export class ChiaComponent {
  breadCrumbItems!: Array<{}>;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Chia', active: true }
    ];
  }

}
