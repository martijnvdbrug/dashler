import {Context, ResolveProperty, Resolver} from '@nestjs/graphql';
import {Dashboard} from '../../lib/shared/graphql-types';
import {DashboardService} from '../dashboard/dashboard.service';

@Resolver('Team')
export class TeamResolver {

  constructor(
    private dashboardService: DashboardService
  ) {
  }

  @ResolveProperty()
  async dashboards(@Context('team') team: string): Promise<Dashboard[]> {
    return this.dashboardService.getForTeam(team);
  }

}
