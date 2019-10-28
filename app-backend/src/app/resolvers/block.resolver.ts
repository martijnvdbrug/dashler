import {Context, Parent, ResolveProperty, Resolver} from '@nestjs/graphql';
import {Block, Dashboard, Uptime, User} from '../../lib/shared/graphql-types';
import {DashboardService} from '../dashboard/dashboard.service';
import {UptimeService} from '../dashboard/uptime.service';

@Resolver('Block')
export class UserResolver {

  constructor(
    private uptimeService: UptimeService
  ) {
  }

  @ResolveProperty()
  async uptime(@Parent() block: Block, @Context('email') email: string): Promise<Uptime> {
    return this.uptimeService.get(block.url);
  }

}
