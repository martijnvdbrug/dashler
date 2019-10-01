import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {DashboardPage} from './pages/dashboard/dashboard.page';
import {LoginPage} from './pages/login/login.page';


const routes: Routes = [
  {path: 'dashboard/:id', component: DashboardPage},
  {path: 'login', component: LoginPage}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
