import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlocksComponent } from './blocks/blocks.component';
import { FarmersComponent } from './farmers/farmers.component';
import { FarmerComponent } from './farmer/farmer.component';
import { RewardsComponent } from './rewards/rewards.component';
import { RewardComponent } from './reward/reward.component';
import { ChiaComponent } from './chia/chia.component';
import { PoolStatusComponent } from './pool-status/pool-status.component';
import { PoolStatsComponent } from './pool-stats/pool-stats.component';
import { PoolLogsComponent } from './pool-logs/pool-logs.component';
import { InfoFaqComponent } from './info-faq/info-faq.component';
import { InfoFeeComponent } from './info-fee/info-fee.component';
import { InfoTeamComponent } from './info-team/info-team.component';
import { LoginComponent } from './login/login.component';
import { JoinComponent } from './join/join.component';

const routes: Routes = [
  { path: '', component: FarmersComponent },
  { path: 'blocks', component: BlocksComponent },
  { path: 'farmers', component: FarmersComponent },
  { path: 'farmer/:id', component: FarmerComponent},
  { path: 'rewards', component: RewardsComponent },
  { path: 'reward/:id', component: RewardComponent },
  { path: 'chia', component: ChiaComponent },
  { path: 'pool/status', component: PoolStatusComponent },
  { path: 'pool/stats', component: PoolStatsComponent },
  { path: 'pool/logs', component: PoolLogsComponent },
  { path: 'info/faq', component: InfoFaqComponent },
  { path: 'info/fee', component: InfoFeeComponent },
  { path: 'info/team', component: InfoTeamComponent },
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: LoginComponent },
  { path: 'join', component: JoinComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PagesRoutingModule { }
