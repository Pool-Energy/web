import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [
    BreadcrumbsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
  ],
  exports: [
    BreadcrumbsComponent,
  ]
})

export class SharedModule { }
