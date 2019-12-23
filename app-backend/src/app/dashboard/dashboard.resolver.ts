import {Context, Parent, ResolveProperty, Resolver} from '@nestjs/graphql';
import {Block, Dashboard, HourRange, Uptime} from '../../lib/shared/graphql-types';
import {UptimeService} from './uptime.service';
import {DashboardService} from './dashboard.service';
import {DashboardEntity} from './model/dashboard.entity';
import {BlockEntity} from './model/block.entity';

@Resolver()
export class DashboardResolver {

  constructor(
    private uptimeService: UptimeService,
    private dashboardService: DashboardService
  ) {
  }

  @ResolveProperty('dashboards')
  @Resolver('Team')
  async dashboards(@Context('team') team: string): Promise<Dashboard[]> {
    return this.dashboardService.getForTeam(team);
  }

  @ResolveProperty('blocks')
  @Resolver('Dashboard')
  async blocks(@Parent() dashboard: DashboardEntity): Promise<Block[]> {
    return dashboard && dashboard.blocks ? dashboard.blocks : [];
  }

  @ResolveProperty('uptime')
  @Resolver('Block')
  async uptime(@Parent() block: BlockEntity, @Context('email') email: string): Promise<Uptime> {
    if (!block.uptimeId) {
      return undefined;
    }
    return this.uptimeService.get((block as BlockEntity).uptimeId);
  }

}
