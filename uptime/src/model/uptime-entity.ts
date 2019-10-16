import {Uptime} from '../lib/shared/graphql-types';
import {UptimeRequest} from './uptime-request';

export interface UptimeEntity extends Uptime {
  requests: UptimeRequest[];
}
