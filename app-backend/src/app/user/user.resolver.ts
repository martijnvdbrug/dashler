import {Context, ResolveProperty, Resolver} from '@nestjs/graphql';
import {Dashboard, User} from '../../lib/shared/graphql-types';
import {UserService} from './user.service';

@Resolver()
export class UserResolver {

  constructor(
    private userService: UserService,
  ) {
  }

  @ResolveProperty('members')
  @Resolver('Team')
  async members(@Context('team') team: string): Promise<User[]> {
    return this.userService.getForTeam(team);
  }

}
