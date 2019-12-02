import {Args, Context, Mutation, Parent, Query, ResolveProperty, Resolver} from '@nestjs/graphql';
import {BlockInput, Dashboard, DashboardInput, User} from '../../lib/shared/graphql-types';
import {DashboardService} from '../dashboard/dashboard.service';
import {Injectable} from '@nestjs/common';
import {UserService} from '../user/user.service';
import {PaymentService} from '../payment/payment.service';

@Injectable()
export class QueryResolver {

  constructor(
    private dashboardService: DashboardService,
    private userService: UserService,
    private paymentService: PaymentService
  ) {
  }

  @Query('Dashboard')
  async getDashboard(@Args('id') id: string, @Context('email') email: string): Promise<Dashboard> {
    if (!id) {
      return this.dashboardService.getFirstForUser(email);
    }
    return this.dashboardService.get(id, email);
  }

  @Query('Me')
  async getUser(@Context('email') email: string): Promise<User> {
    return this.userService.get(email);
  }

  @Query('StripeSessionId')
  async getStripeSessionId(@Context('email') email: string): Promise<string> {
    return this.paymentService.getSessionId(email);
  }

}
