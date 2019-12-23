import {Block} from '../../../lib/shared/graphql-types';

export interface BlockEntity extends Block {
  uptimeId: string;
}
