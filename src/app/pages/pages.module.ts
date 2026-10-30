import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxFilesizeModule } from 'ngx-filesize';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbAccordionModule, NgbNavModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgTerminalModule } from 'ng-terminal';
import { TranslatePipe } from '@ngx-translate/core';

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
import { PoolLogsComponent } from './pool-logs/pool-logs.component';
import { PartialsComponent } from './partials/partials.component';
import { InfoFaqComponent } from './info-faq/info-faq.component';
import { InfoFeeComponent } from './info-fee/info-fee.component';
import { InfoTeamComponent } from './info-team/info-team.component';
import { LoginComponent } from './login/login.component';
import { JoinComponent } from './join/join.component';

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
    PoolLogsComponent,
    PartialsComponent,
    InfoFaqComponent,
    InfoFeeComponent,
    InfoTeamComponent,
    LoginComponent,
    JoinComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    PagesRoutingModule,
    SharedModule,
    NgxFilesizeModule,
    NgApexchartsModule,
    NgbAccordionModule,
    NgbNavModule,
    NgbCollapseModule,
    NgTerminalModule,
    TranslatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class PagesModule {}
