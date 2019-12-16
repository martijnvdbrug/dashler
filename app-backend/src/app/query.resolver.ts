import {Args, Context, Query} from '@nestjs/graphql';
import {Dashboard, Team, User} from '../lib/shared/graphql-types';
import {DashboardService} from './dashboard/dashboard.service';
import {ForbiddenException, Injectable} from '@nestjs/common';
import {UserService} from './user/user.service';
import {PaymentService} from './payment/payment.service';
import {TeamService} from './team/team.service';
import {Ctx} from './user/model/ctx';

@Injectable()
export class QueryResolver {

  constructor(
    private dashboardService: DashboardService,
    private userService: UserService,
    private teamService: TeamService,
    private paymentService: PaymentService
  ) {
  }

  @Query('Dashboard')
  async getDashboard(@Args('id') id: string, @Context() ctx: Ctx): Promise<Dashboard> {
    if (!id) {
      return this.dashboardService.getFirstForTeam(ctx.team);
    }
    return this.dashboardService.get(id, ctx.team);
  }

  @Query('User')
  async getUser(@Context() ctx: Ctx, @Args('id') id?: string): Promise<User> {
    if (id && !ctx.isAdmin) {
      throw new ForbiddenException(`Argument 'id' can only be used by Admins`);
    }
    return this.userService.get(id ? id : ctx.email);
  }

  @Query('Team')
  async getTeam(@Context() ctx: Ctx, @Args('id') id: string): Promise<Team> {
    if (id && !ctx.isAdmin) {
      throw new ForbiddenException(`Argument 'id' can only be used by Admins`);
    }
    return this.teamService.get(id ? id : ctx.team);
  }

  @Query('StripeSessionId')
  async getStripeSessionId(@Context() ctx: Ctx): Promise<string> {
    return this.paymentService.getSessionId(ctx.email);
  }

}
