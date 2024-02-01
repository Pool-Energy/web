import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlocksComponent } from './blocks/blocks.component';
import { FarmersComponent } from './farmers/farmers.component';
import { ChiaComponent } from './chia/chia.component';
import { PoolStatusComponent } from './pool-status/pool-status.component';
import { PoolStatsComponent } from './pool-stats/pool-stats.component';
import { InfoFaqComponent } from './info-faq/info-faq.component';
import { InfoApiComponent } from './info-api/info-api.component';
import { InfoFeeComponent } from './info-fee/info-fee.component';
import { InfoTeamComponent } from './info-team/info-team.component';

const routes: Routes = [
  { path: "blocks", component: BlocksComponent },
  { path: "farmers", component: FarmersComponent },
  { path: "chia", component: ChiaComponent },
  { path: "pool-status", component: PoolStatusComponent },
  { path: "pool-stats", component: PoolStatsComponent },
  { path: "info-faq", component: InfoFaqComponent },
  { path: "info-api", component: InfoApiComponent },
  { path: "info-fee", component: InfoFeeComponent },
  { path: "info-team", component: InfoTeamComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ViewsRoutingModule { }
