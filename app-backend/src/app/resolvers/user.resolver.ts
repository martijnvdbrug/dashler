import {Context, ResolveProperty, Resolver} from '@nestjs/graphql';
import {Dashboard, User} from '../../lib/shared/graphql-types';
import {DashboardService} from '../dashboard/dashboard.service';

@Resolver('User')
export class UserResolver {

  constructor(
    private dashboardService: DashboardService
  ) {
  }

  @ResolveProperty()
  async dashboards(@Context('email') email: string): Promise<Dashboard[]> {
    return this.dashboardService.getForUser(email);
  }

}
