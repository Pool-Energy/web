import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CountUpModule } from 'ngx-countup';
import { RouterModule } from '@angular/router';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [
    BreadcrumbsComponent,
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    SlickCarouselModule ,
    CountUpModule,
    RouterModule,
  ],
  exports: [
    BreadcrumbsComponent,
  ]
})

export class SharedModule { }
