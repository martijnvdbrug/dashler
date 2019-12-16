import {Args, Context, Mutation} from '@nestjs/graphql';
import {BlockInput, Dashboard, DashboardInput, Team} from '../lib/shared/graphql-types';
import {DashboardService} from './dashboard/dashboard.service';
import {ForbiddenException, Injectable} from '@nestjs/common';
import {Ctx} from './user/model/ctx';
import {UserService} from './user/user.service';

@Injectable()
export class MutationResolver {

  constructor(
    private dashboardService: DashboardService,
    private userService: UserService,
  ) {
  }

  @Mutation()
  async createDashboard(
    @Args('input') input: DashboardInput,
    @Context() ctx: Ctx): Promise<Dashboard> {
    return this.dashboardService.create(input, ctx.team);
  }

  @Mutation()
  async removeDashboard(
    @Args('id') id: string,
    @Context() ctx: Ctx): Promise<boolean> {
    return this.dashboardService.remove(id, ctx.team);
  }

  @Mutation()
  async addBlock(
    @Args('dashboardId') dashboardId: string,
    @Args('input') input: BlockInput,
    @Context() ctx: Ctx): Promise<Dashboard> {
    return this.dashboardService.addBlock(dashboardId, input, ctx.team);
  }

  @Mutation()
  async removeBlock(
    @Args('dashboardId') dashboardId: string,
    @Args('blockId') blockId: string,
    @Context() ctx: Ctx): Promise<Dashboard> {
    return this.dashboardService.removeBlock(dashboardId, blockId, ctx.team);
  }

  @Mutation()
  async addMember(
    @Args('userId') userId: string,
    @Args('teamId') teamId: string,
    @Context() ctx: Ctx): Promise<Team> {
    if (teamId && !ctx.isAdmin) {
      throw new ForbiddenException(`Argument 'id' can only be used by Admins`);
    }
    return this.userService.addToTeam(userId, teamId ? teamId : ctx.team);
  }

  @Mutation()
  async removeMember(
    @Args('userId') userId: string,
    @Args('teamId') teamId: string,
    @Context() ctx: Ctx): Promise<Team> {
    if (teamId && !ctx.isAdmin) {
      throw new ForbiddenException(`Argument 'id' can only be used by Admins`);
    }
    return this.userService.removeFromTeam(userId, teamId ? teamId : ctx.team);
  }

}
