import {UptimeCheck} from './model/uptime-check';
import {UptimeStats} from './lib/shared/graphql-types';
import shortid = require('shortid');

export class StatsService {

  static readonly timeoutAfter = 2000;

  /**
   * Calculate stats based on current checks
   */
  static calculate(checks: UptimeCheck[], stats: UptimeStats): UptimeStats {
    let ms0_500 = 0;
    let ms500_1 = 0;
    let s1_2 = 0;
    let s2 = 0;
    let error = 0;
    checks.forEach(check => {
      if (check.statusCode >= 400) {
        error++;
      } else if (check.duration > 0 && check.duration <= 500) {
        ms0_500++;
      } else if (check.duration > 500 && check.duration <= 1000) {
        ms500_1++;
      } else if (check.duration > 500 && check.duration <= 2000) {
        s1_2++;
      } else if (check.duration > this.timeoutAfter) {
        s2++;
      } else {
        error++;
      }
    });
    return {
      id: stats && stats.id ? stats.id : shortid(),
      createdAt: stats && stats.createdAt ? stats.createdAt : new Date(),
      updatedAt: new Date(),
      ms0_500,
      ms500_1,
      s1_2,
      s2,
      error
    };
  }

  /**
   * Normalize to 100%
   */
  static normalize(stats: UptimeStats) {
    const total = stats.ms0_500 + stats.ms500_1 + stats.s1_2 + stats.s2 + stats.error;
    const ratio = 100 / total;
    return {
      ...stats,
      ms0_500: Math.round(stats.ms0_500 * ratio),
      ms500_1: Math.round(stats.ms500_1 * ratio),
      s1_2: Math.round(stats.s1_2 * ratio),
      s2: Math.round(stats.s2 * ratio),
      error: Math.round(stats.error * ratio)
    };
  }

}
