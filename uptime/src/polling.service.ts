import rp = require('request-promise-native');
import {UptimeResponse} from './model/uptime-response';
import {DatastoreClient} from './lib/datastore/datastore.client';
import {Uptime} from './lib/shared/graphql-types';
import {UptimeEntity} from './model/uptime-entity';
import {StatsService} from './stats.service';

/**
 * Poll URLS from pubsub
 */
export class PollingService {

  static datastore = new DatastoreClient<UptimeEntity>('Uptime');

  static async checkMultiple(ids: string[]): Promise<void> {
    if (!ids || ids.length === 0) {
      console.log('No urls in message, skipping');
      return;
    }
    const uptimes = await this.datastore.getMultiple(ids);
    const updated = await Promise.all(uptimes.map(u => this.check(u)));
    await this.datastore.saveMultiple(updated);
    console.log(`Polled ${updated.length} urls`);
  }

  /**
   * Checks urls, deletes old checks, calculates stats and returns. DOES NOT save in datastore
   */
  static async check(uptime: UptimeEntity): Promise<UptimeEntity> {
    const response = await this.request(uptime.url);
    if (uptime.webhook && response.statusCode === 500) {
      await this.notify(uptime.webhook, `${uptime.url} is down`, uptime.url);
    } else if (uptime.webhook && response.durationInMs > StatsService.timeoutAfter) {
      await this.notify(uptime.webhook, `${uptime.url} failed to respond within ${StatsService.timeoutAfter}ms`, uptime.url);
    }
    if (!uptime.checks) {
      uptime.checks = [];
    }
    const now = Math.round(new Date().getTime() / 1000);
    const yesterday = now - (24 * 3600);
    uptime.checks = uptime.checks.filter(check => check.createdAt && check.createdAt > yesterday);
    uptime.checks.push({
      createdAt: now,
      duration: response.durationInMs,
      statusCode: response.statusCode
    });
    uptime.stats = StatsService.calculate(uptime.checks, uptime.stats);
    uptime.stats = StatsService.normalize(uptime.stats); // normalize to add up to 100%
    return uptime;
  }

  static async request(url): Promise<UptimeResponse> {
    return rp(url, {
      time: true,
      simple: false,
      resolveWithFullResponse: true,
      timeout: 2000
    })
      .then((response) => {
        return {
          statusCode: response.statusCode,
          durationInMs: response.elapsedTime,
        };
      })
      .catch((err) => {
        console.error(`Error polling: ${url}:`, err.message);
        return {
          statusCode: err.message === 'Error: ESOCKETTIMEDOUT' ? 200 : 500,
          durationInMs: StatsService.timeoutAfter + 99,
        };
      });
  }

  static async notify(webhook: string, message: string, url: string): Promise<void> {
    try {
      await rp({
        method: 'POST',
        uri: webhook,
        body: {
          text: message
        },
        json: true // Automatically stringifies the body to JSON
      });
    } catch (err) {
      console.error(`Failed to notify ${url}:`, err);
    }

  }

}
