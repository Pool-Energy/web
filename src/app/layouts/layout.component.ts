import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    standalone: false
})

export class LayoutComponent implements OnInit {
  layoutType!: string;

  data: any = {
    "LAYOUT": "horizontal",
    "LAYOUT_MODE": "light",
    "LAYOUT_WIDTH": "fluid",
    "LAYOUT_POSITION": "fixed",
    "TOPBAR": "dark",
    "SIDEBAR_COLOR": "dark",
    "SIDEBAR_SIZE": "lg",
    "SIDEBAR_IMAGE": "none",
    "SIDEBAR_VIEW": "default",
    "SIDEBAR_VISIBILITY": "show"
  }

  ngOnInit(): void {
    this.layoutType = this.data.LAYOUT;
    document.documentElement.setAttribute('data-layout', this.data.LAYOUT);
    document.documentElement.setAttribute('data-bs-theme', this.data.LAYOUT_MODE);
    document.documentElement.setAttribute('data-layout-width', this.data.LAYOUT_WIDTH);
    document.documentElement.setAttribute('data-layout-position', this.data.LAYOUT_POSITION);
    document.documentElement.setAttribute('data-topbar', this.data.TOPBAR);
    this.data.LAYOUT == "vertical" || this.data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-sidebar', this.data.SIDEBAR_COLOR) : '';
    this.data.LAYOUT == "vertical" || this.data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-sidebar-size', this.data.SIDEBAR_SIZE) : '';
    this.data.LAYOUT == "vertical" || this.data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-sidebar-image', this.data.SIDEBAR_IMAGE) : '';
    this.data.LAYOUT == "vertical" || this.data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-layout-style', this.data.SIDEBAR_VIEW) : '';
    document.documentElement.setAttribute('data-sidebar-visibility', this.data.SIDEBAR_VISIBILITY);
  }

}
