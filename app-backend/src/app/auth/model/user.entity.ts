import {User} from '../../../lib/shared/graphql-types';

export interface UserEntity extends User {
  provider: string;
  locale: string;
  originId: string;
}
