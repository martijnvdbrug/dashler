import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {BlockInput, Dashboard, DashboardInput} from '../../lib/shared/graphql-types';
import {DashboardService} from './dashboard.service';

@Resolver('Dashboard')
export class DashboardResolver {

  constructor(
    private dashboardService: DashboardService
  ) {
  }

  @Query('Dashboard')
  async getDashboard(@Args('id') id: string, @Context('email') email: string): Promise<Dashboard> {
    if (!id) {
      return this.dashboardService.getFirstForUser(email);
    }
    return this.dashboardService.get(id, email);
  }


  @Mutation()
  async createDashboard(@Args('input') input: DashboardInput, @Context('email') email: string): Promise<Dashboard> {
    return this.dashboardService.create(input, email);
  }

  @Mutation()
  async addBlock(
    @Args('dashboardId') dashboardId: string,
    @Args('input') input: BlockInput,
    @Context('email') email: string): Promise<Dashboard> {
    return this.dashboardService.addBlock(dashboardId, input);
  }

  @Mutation()
  async removeBlock(
    @Args('dashboardId') dashboardId: string,
    @Args('blockId') blockId: string,
    @Context('email') email: string): Promise<Dashboard> {
    return this.dashboardService.removeBlock(dashboardId, blockId);
  }

}
