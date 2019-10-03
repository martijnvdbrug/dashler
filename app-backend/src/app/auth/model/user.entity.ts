import {User} from '../../../lib/shared/graphql-types';

export interface UserEntity extends User {
  locale: string;
  originId: string;
}
