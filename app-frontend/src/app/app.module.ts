import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BlockComponent} from './components/block/block.component';
import {DashboardService} from './providers/dashboard.service';
import {APOLLO_BOOST_CONFIG, ApolloBoostModule} from 'apollo-angular-boost';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DashboardPage} from './pages/dashboard/dashboard.page';
import {LoginPage} from './pages/login/login.page';
import {LoginHandler} from './pages/login/login.handler';
import {AuthGuard} from './guards/auth.guard';
import {UserService} from './providers/user.service';

@NgModule({
  declarations: [
    AppComponent,
    BlockComponent,
    DashboardPage,
    LoginPage,
    LoginHandler
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApolloBoostModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    AuthGuard,
    DashboardService,
    UserService,
    {
      provide: APOLLO_BOOST_CONFIG,
      useFactory() {
        return {
          uri: 'http://localhost:8999/graphql',
          request: (operation) => {
            const token = localStorage.getItem('token');
            operation.setContext({
              headers: {
                authorization: token ? `Bearer ${token}` : ''
              }
            });
          }
        };
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
