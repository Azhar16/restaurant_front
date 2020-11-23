import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './login/login.component';

export const appRoutingComponent = [
  LoginComponent
];

const appRoutes: Routes = [
  {
    /* leading slash should not be given in the path */
    path: '',
    redirectTo: '/login', /* in redirectTo the leading slash is required */
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  }
]
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
