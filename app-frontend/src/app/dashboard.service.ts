import {Injectable} from '@angular/core';
import {Dashboard} from '../../../shared/graphql-types';
import {getDashboardQuery} from './dashboard.queries';
import { Apollo } from 'apollo-angular-boost';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private apollo: Apollo
  ) {
  }

  async getDashboard(id: string): Promise<Dashboard> {
    this.apollo.watchQuery({
      query: getDashboardQuery,
      variables: {id}
    }).valueChanges
      .subscribe(({ data}) => {
        console.log('dashboard', data);
      });
    return undefined;
  }
}
