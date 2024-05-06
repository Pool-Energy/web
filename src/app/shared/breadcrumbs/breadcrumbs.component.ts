import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})

export class BreadcrumbsComponent implements OnInit {
  @Input() title: string | undefined;
  @Input()

  breadcrumbItems!: Array<{
    active?: boolean;
    label?: string;
    link?: string;
  }>;

  constructor() { }

  ngOnInit(): void { }

}
