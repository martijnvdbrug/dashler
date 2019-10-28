import {Context, Parent, ResolveProperty, Resolver} from '@nestjs/graphql';
import {Block, Uptime} from '../../lib/shared/graphql-types';
import {UptimeService} from '../dashboard/uptime.service';

@Resolver('Block')
export class BlockResolver {

  constructor(
    private uptimeService: UptimeService
  ) {
  }

  @ResolveProperty()
  async uptime(@Parent() block: Block, @Context('email') email: string): Promise<Uptime> {
    if (!block.url) {
      return undefined;
    }
    return this.uptimeService.get(block.url);
  }

}
