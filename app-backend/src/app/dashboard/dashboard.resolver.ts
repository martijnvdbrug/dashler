import {Args, Mutation, Query, ResolveProperty, Resolver} from '@nestjs/graphql';
import {Dashboard, DashboardInput} from '../../lib/shared/graphql-types';
import {DashboardService} from './dashboard.service';

@Resolver('Dashboard')
export class DashboardResolver {

  constructor(
    private dashboardService: DashboardService
  ) {
  }

  @Query('Dashboard')
  async getDashboard(@Args('id') id: string): Promise<Dashboard> {
    return this.dashboardService.get(id);
  }


  @Mutation()
  async createDashboard(@Args('input') input: DashboardInput): Promise<Dashboard> {
    return this.dashboardService.create(input);
  }

}
