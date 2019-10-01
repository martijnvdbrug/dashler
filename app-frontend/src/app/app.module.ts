import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BlockComponent} from './components/block/block.component';
import {DashboardService} from './dashboard.service';
import {APOLLO_BOOST_CONFIG, ApolloBoostModule} from 'apollo-angular-boost';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DashboardPage} from './pages/dashboard/dashboard.page';
import {LoginPage} from './pages/login/login.page';

@NgModule({
  declarations: [
    AppComponent,
    BlockComponent,
    DashboardPage,
    LoginPage
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
    DashboardService,
    {
      provide: APOLLO_BOOST_CONFIG,
      useFactory() {
        return {
          uri: 'http://localhost:8999/graphql'
        };
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
