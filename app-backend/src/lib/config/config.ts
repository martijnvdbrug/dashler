import {ConfigInterface} from './config.interface';

require('dotenv').config();

export const CONFIG = process.env as unknown as ConfigInterface;
if (process.env.NODE_ENV !== 'production') {
  CONFIG.host = 'http://localhost:8999';
}
