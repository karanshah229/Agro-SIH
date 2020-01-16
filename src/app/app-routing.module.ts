import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/guards/auth.guard';
import { LoginGuard } from 'src/guards/login.guard';

import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileCompletionComponent } from './profile-completion/profile-completion.component';
import { PestDetectionComponent } from './dashboard/pest-detection/pest-detection.component';
import { ForumComponent } from './dashboard/forum/forum.component';
import { SowingComponent } from './dashboard/sowing/sowing.component';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { ClimateComponent } from './dashboard/climate/climate.component';

const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full', canActivate: [LoginGuard] },
  { path: 'signIn', redirectTo: '', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent ,/* canActivate: [AuthGuard],*/
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'pest-detection', component: PestDetectionComponent },
      { path: 'sowing', component: SowingComponent },
      { path: 'climate', component: ClimateComponent },
      { path: 'forum', component: ForumComponent },
    ]
  },
  { path: 'profileCompletion', component: ProfileCompletionComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
