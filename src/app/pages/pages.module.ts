import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgPipesModule } from 'ngx-pipes';
import { NgxFilesizeModule } from 'ngx-filesize';
import { defineElement } from "@lordicon/element";
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbAccordionModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import lottie from 'lottie-web';

import { MaxLengthPipe } from './pipes/maxlength.pipe';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { BlocksComponent } from './blocks/blocks.component';
import { FarmersComponent } from './farmers/farmers.component';
import { FarmerComponent } from './farmer/farmer.component';
import { RewardsComponent } from './rewards/rewards.component';
import { RewardComponent } from './reward/reward.component';
import { ChiaComponent } from './chia/chia.component';
import { PoolStatusComponent } from './pool-status/pool-status.component';
import { PoolStatsComponent } from './pool-stats/pool-stats.component';
import { InfoFaqComponent } from './info-faq/info-faq.component';
import { InfoApiComponent } from './info-api/info-api.component';
import { InfoFeeComponent } from './info-fee/info-fee.component';
import { InfoTeamComponent } from './info-team/info-team.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    MaxLengthPipe,
    BlocksComponent,
    FarmersComponent,
    FarmerComponent,
    RewardsComponent,
    RewardComponent,
    ChiaComponent,
    PoolStatusComponent,
    PoolStatsComponent,
    InfoFaqComponent,
    InfoApiComponent,
    InfoFeeComponent,
    InfoTeamComponent,
    LoginComponent
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
    PagesRoutingModule,
    SharedModule,
    SimplebarAngularModule,
    NgPipesModule,
    NgxFilesizeModule,
    NgApexchartsModule,
    NgbAccordionModule,
    NgbNavModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class PagesModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
