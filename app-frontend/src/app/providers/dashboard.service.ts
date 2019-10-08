import {Injectable} from '@angular/core';
import {BlockInput, Dashboard} from '../../../../shared/graphql-types';
import {addBlockMutation, getDashboardQuery, removeBlockMutation} from './dashboard.queries';
import {Apollo} from 'apollo-angular-boost';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserService} from './user.service';

@Injectable()
export class DashboardService {

  constructor(
    private apollo: Apollo,
    private userService: UserService
  ) {
  }

  get(id: string): Observable<Dashboard> {
    return this.apollo.watchQuery<any>({
      query: getDashboardQuery,
      pollInterval: 1000 * 60,
      variables: {id}
    }).valueChanges
      .pipe(map(result => result.data.Dashboard));
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
