import {Injectable} from '@angular/core';
import {BlockInput, Dashboard} from '../../lib/shared/graphql-types';
import {addBlockMutation, getDashboardQuery, removeBlockMutation} from './dashboard.queries';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Apollo} from 'apollo-angular-boost';

@Injectable()
export class DashboardService {

  constructor(
    private apollo: Apollo,
  ) {
  }

  get(id: string): Observable<Dashboard> {
    return this.apollo.watchQuery<any>({
      query: getDashboardQuery,
      pollInterval: 1000 * 60,
      variables: {id}
    }).valueChanges
      .pipe(map((result: any) => result.data.Dashboard));
  }

  async addBlock(dashboardId: string, input: BlockInput): Promise<Dashboard> {
    const result = await this.apollo.mutate<any>({
      mutation: addBlockMutation,
      variables: {dashboardId, input}
    }).toPromise();
    return result.data.addBlock;
  }

  async removeBlock(dashboardId: string, blockId: string): Promise<Dashboard> {
    const result = await this.apollo.mutate<any>({
      mutation: removeBlockMutation,
      variables: {dashboardId, blockId}
    }).toPromise();
    return result.data.removeBlock;
  }


}
