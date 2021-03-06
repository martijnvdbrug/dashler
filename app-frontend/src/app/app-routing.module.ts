import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardPage} from './pages/dashboard/dashboard.page';
import {LoginPage} from './pages/login/login.page';
import {AuthGuard} from './guards/auth.guard';
import {LoginHandler} from './pages/login/login.handler';
import {PaymentPage} from './pages/payment/payment.page';


const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'login/success/:jwt', component: LoginHandler},
  {path: 'login/error', component: LoginPage},
  {path: 'login', component: LoginPage},
  {path: 'dashboard', component: DashboardPage, canActivate: [AuthGuard]},
  {path: 'dashboard/:id', component: DashboardPage, canActivate: [AuthGuard]},
  {path: 'payment', component: PaymentPage, canActivate: [AuthGuard]},
  {path: 'payment/:success', component: PaymentPage, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
