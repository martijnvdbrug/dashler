import {Dashboard} from '../../../lib/shared/graphql-types';

export interface DashboardEntity extends Dashboard {
  users: string[];
}
