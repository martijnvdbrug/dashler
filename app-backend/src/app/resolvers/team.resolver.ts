import {Context, ResolveProperty, Resolver} from '@nestjs/graphql';
import {Dashboard, User} from '../../lib/shared/graphql-types';
import {DashboardService} from '../dashboard/dashboard.service';
import {UserService} from '../user/user.service';

@Resolver('Team')
export class TeamResolver {

  constructor(
    private dashboardService: DashboardService,
    private userService: UserService,
  ) {
  }

  @ResolveProperty()
  async dashboards(@Context('team') team: string): Promise<Dashboard[]> {
    return this.dashboardService.getForTeam(team);
  }

  @ResolveProperty()
  async members(@Context('team') team: string): Promise<User[]> {
    return this.userService.getForTeam(team);
  }

}
