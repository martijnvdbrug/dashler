import {ConfigInterface} from './config.interface';

require('dotenv').config();


export const CONFIG = process.env as unknown as ConfigInterface;
if (process.env.NODE_ENV !== 'production') {
  CONFIG.host = 'http://localhost:8999';
  CONFIG.appHost = 'http://localhost:4200';
  CONFIG.stripePROPlan = 'plan_GHmsOo2Zs0yjdQ'; // test plan
  CONFIG.stripeWebhookSecret = 'whsec_GHBVnpmO9UsKkusjHSJhHUTaX24zuHF2'; // test secret
}
