import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProfileCompletionComponent } from './profile-completion/profile-completion.component';
import { LoginGuard } from 'src/guards/login.guard';

const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full', canActivate: [LoginGuard] },
  { path: 'signIn', redirectTo: '', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent/*, canActivate: [AuthGuard] */},
  { path: 'profileCompletion', component: ProfileCompletionComponent/*, canActivate: [AuthGuard] */}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
