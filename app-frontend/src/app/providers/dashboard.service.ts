import {Injectable} from '@angular/core';
import {BlockInput, Dashboard, DashboardInput} from '../../lib/shared/graphql-types';
import {addBlockMutation, createDashboardMutation, getDashboardQuery, removeBlockMutation, updateBlockMutation} from './dashboard.queries';
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
      errorPolicy: 'all',
      variables: {id}
    }).valueChanges
      .pipe(map((result: any) => result.data.Dashboard));
  }

  async addBlock(dashboardId: string, input: BlockInput): Promise<Dashboard> {
    const result = await this.apollo.mutate<any>({
      mutation: addBlockMutation,
      errorPolicy: 'none',
      variables: {dashboardId, input}
    }).toPromise();
    return result.data.addBlock;
  }

  async updateBlock(dashboardId: string, blockId: string, input: BlockInput): Promise<Dashboard> {
    const result = await this.apollo.mutate<any>({
      mutation: updateBlockMutation,
      errorPolicy: 'none',
      variables: {dashboardId, blockId, input}
    }).toPromise();
    return result.data.addBlock;
  }

  async createDashboard(input: DashboardInput): Promise<Dashboard> {
    const result = await this.apollo.mutate<any>({
      mutation: createDashboardMutation,
      errorPolicy: 'none',
      variables: {input}
    }).toPromise();
    return result.data.createDashboard;
  }

  async removeBlock(dashboardId: string, blockId: string): Promise<Dashboard> {
    const result = await this.apollo.mutate<any>({
      mutation: removeBlockMutation,
      errorPolicy: 'none',
      variables: {dashboardId, blockId}
    }).toPromise();
    return result.data.removeBlock;
  }

}
