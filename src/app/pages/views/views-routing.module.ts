import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { BlocksComponent } from './blocks/blocks.component';

const routes: Routes = [
  {
    path: "blocks",
    component: BlocksComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ViewsRoutingModule { }
