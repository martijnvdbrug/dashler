import {Dashboard} from '../../../lib/shared/graphql-types';
import {BlockEntity} from './block.entity';

export interface DashboardEntity extends Dashboard {
  teamId: string;
  blocks: BlockEntity[];
}
