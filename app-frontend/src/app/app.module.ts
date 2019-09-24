import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlockComponent } from './components/block/block.component';
import {DashboardService} from './dashboard.service';
import {APOLLO_BOOST_CONFIG, ApolloBoost, ApolloBoostModule} from 'apollo-angular-boost';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    BlockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApolloBoostModule,
    HttpClientModule
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
export class AppModule {}
