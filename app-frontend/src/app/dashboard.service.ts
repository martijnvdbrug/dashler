import {Injectable, OnInit} from '@angular/core';
import {Dashboard} from '../../../shared/graphql-types';
import {getDashboardQuery} from './dashboard.queries';
import { Apollo } from 'apollo-angular-boost';
import {interval, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private apollo: Apollo
  ) {
  }

  getDashboard(id: string): Observable<Dashboard> {
    return this.apollo.watchQuery<any>({
      query: getDashboardQuery,
      variables: {id}
    }).valueChanges
      .pipe(map(result => result.data.Dashboard));
  }


}
