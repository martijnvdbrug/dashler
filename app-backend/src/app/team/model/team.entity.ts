import {Team} from '../../../lib/shared/graphql-types';

export interface TeamEntity extends Team {
  dashboardIds: string[];
  memberIds: string[];
}
