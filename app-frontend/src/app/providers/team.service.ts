import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular-boost';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Dashboard, Team} from '../../lib/shared/graphql-types';
import {getTeamWithDashboardsAndPlan} from './team.queries';

@Injectable()
export class TeamService {


  constructor(
    private apollo: Apollo,
  ) {
  }

  /**
   * Gets team with plan, dashboardIds and dashboard names
   */
  getTeam(): Observable<Team> {
    return this.apollo.watchQuery<any>({
      query: getTeamWithDashboardsAndPlan,
    }).valueChanges
      .pipe(
        map(result => result.data.Team));
  }


}
