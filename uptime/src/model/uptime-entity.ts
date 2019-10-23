import {Uptime} from '../lib/shared/graphql-types';
import {UptimeCheck} from './uptime-check';

export interface UptimeEntity extends Uptime {
  checks: UptimeCheck[];
}
