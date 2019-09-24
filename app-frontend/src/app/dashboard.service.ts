import { Injectable } from '@angular/core';
import {GraphqlClient} from './graphql.client';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private client: GraphqlClient
  ) {
    console.log('bla', this.client.link);
  }
}
