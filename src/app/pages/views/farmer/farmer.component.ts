import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrl: './farmer.component.scss'
})
export class FarmerComponent {
  breadCrumbItems!: Array<{}>;

  launcher_id: any = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(data => {
      this.launcher_id = data.get('id');
      this.breadCrumbItems = [
        { label: 'Farmers' },
        { label: this.launcher_id, active: true }
      ];
    });
  }

}
