import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { LoginComponent } from 'src/app/components/security/login/login.component';

// ROUTE GUARD
import { LoginGuard } from 'src/app/guard/login.guard';

const routes: Routes = [
  {
    path: '',
    component: SecurityComponent,
    canActivate: [LoginGuard],
    children: [
      {path: '', redirectTo: 'login', canActivate: [LoginGuard], pathMatch: 'full'},
      {path: 'login', canActivate: [LoginGuard], component: LoginComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }