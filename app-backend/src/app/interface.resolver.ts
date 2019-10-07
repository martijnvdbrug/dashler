import {Resolver, ResolveProperty} from '@nestjs/graphql';

@Resolver('GraphqlNode')
export class InterfaceResolver {

  @ResolveProperty('__resolveType')
  resolveType(obj): string {
    return 'GraphqlNode';
  }

}
