import {ConfigInterface} from './config.interface';

require('dotenv').config();

export const CONFIG = process.env as unknown as ConfigInterface;
