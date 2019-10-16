import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BlockComponent} from './components/block/block.component';
import {DashboardService} from './providers/dashboard.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DashboardPage} from './pages/dashboard/dashboard.page';
import {LoginPage} from './pages/login/login.page';
import {LoginHandler} from './pages/login/login.handler';
import {AuthGuard} from './guards/auth.guard';
import {UserService} from './providers/user.service';
import {environment} from '../environments/environment';
import {ApolloBoostModule, APOLLO_BOOST_CONFIG, ApolloBoost} from 'apollo-angular-boost';
import {LoaderComponent} from './components/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    BlockComponent,
    DashboardPage,
    LoginPage,
    LoginHandler,
    LoaderComponent
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
/*    {
      provide: APOLLO_BOOST_CONFIG,
      useFactory() {
        return {
          uri: `${environment.authServer}/graphql`,
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
    }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(apolloBoost: ApolloBoost) {
      apolloBoost.create({
        uri: `${environment.authServer}/graphql`,
        request: async (operation) => {
          const token = localStorage.getItem('token');
          operation.setContext({
            headers: {
              authorization: token ? `Bearer ${token}` : ''
            }
          });
        }
      });

  }
}
