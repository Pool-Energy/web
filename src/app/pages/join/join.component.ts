import { Component } from '@angular/core';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss'
})

export class JoinComponent {
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pool' },
      { label: 'Join', active: true }
    ];
  }

}
