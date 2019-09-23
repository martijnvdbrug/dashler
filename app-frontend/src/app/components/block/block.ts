import {ResponseTime} from './response-time';
import {Button} from './button';

export interface Block {
  id: string;
  name: string;
  responseTime: ResponseTime;
  buttons: Button[];
}
