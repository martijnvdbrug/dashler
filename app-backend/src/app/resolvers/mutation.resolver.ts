import {Args, Context, Mutation} from '@nestjs/graphql';
import {BlockInput, Dashboard, DashboardInput} from '../../lib/shared/graphql-types';
import {DashboardService} from '../dashboard/dashboard.service';
import {Injectable} from '@nestjs/common';

@Injectable()
export class MutationResolver {

  constructor(
    private dashboardService: DashboardService,
  ) {
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
    return this.dashboardService.addBlock(dashboardId, input, email);
  }

  @Mutation()
  async removeBlock(
    @Args('dashboardId') dashboardId: string,
    @Args('blockId') blockId: string,
    @Context('email') email: string): Promise<Dashboard> {
    return this.dashboardService.removeBlock(dashboardId, blockId);
  }

}
