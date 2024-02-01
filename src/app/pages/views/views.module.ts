import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

// FlatPicker
import { FlatpickrModule } from 'angularx-flatpickr';

// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';

// Ng Search 
import { NgPipesModule } from 'ngx-pipes';

// Load Icon
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Component pages
import { ViewsRoutingModule } from './views-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { BlocksComponent } from './blocks/blocks.component';

@NgModule({
  declarations: [
    BlocksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FlatpickrModule,
    ViewsRoutingModule,
    SharedModule,
    SimplebarAngularModule,
    NgPipesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ViewsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
