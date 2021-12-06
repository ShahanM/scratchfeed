import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeedComponent } from './feed/feed.component';

const routes: Routes = [
  {
    path: '',
    component: FeedComponent,
    outlet: 'feed'
  },
  {
    path: '',
    component: DashboardComponent,
    outlet: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
