import {Uptime} from './lib/shared/graphql-types';
import {DatastoreClient} from './lib/datastore/datastore.client';
import {HourRange} from './lib/shared/graphql-types';
import {PubsubUtil} from './lib/pubsub.util';

/**
 * Get URLS from datastore, and publish the ones that need to be checked to datastore
 */
export class BatchService {

  static topicname = 'uptime-urls-to-poll';
  static repo = new DatastoreClient<Uptime>('Uptime');

  static async publishUrls(): Promise<void> {
    const minuteOfDay = Math.ceil(new Date().getMinutes() / 5 ) * 5;
    const checkForIntervals: number[] = [];
    for (let m = 5; m <= 60; m += 5) {
      if (minuteOfDay % m === 0) {
        checkForIntervals.push(m);
      }
    }
    console.log(`Checking URLs with interval ${checkForIntervals}`);
    const uptimesArray: Uptime[][] = await Promise.all(
      checkForIntervals.map(interval => BatchService.repo.query({property: 'checkInterval', operator: '=', value: interval}))
    );
    const uptimes = uptimesArray.reduce((a, b) => a.concat(b));
    const uptimeIds = uptimes
      .filter(u => {
        const disabled = BatchService.disableNow(u.disabledHours, u.id);
        if (disabled) {
          console.log(`Not checking ${u.url}, because it is disabled`);
        } else {
          console.log(`Going to check ${u.url} now.`);
        }
        return !disabled;
      })
      .map(u => u.id);
    while (uptimeIds.length) {
      const batch = uptimeIds.splice(0, 10);
      if (batch && batch.length > 0) {
        await PubsubUtil.publish(BatchService.topicname, batch);
        console.log(`publishing ${batch.length} urls`);
      }
    }
  }

  /**
   * Check if the uptimeCheck is disabled at this moment
   */
  static disableNow(disabledHours: HourRange, uptimeId: string): boolean {
    if (!disabledHours || !disabledHours.from || !disabledHours.to) {
      return false;
    }
    try {
      if (typeof disabledHours.from === 'string') {
        disabledHours.from = new Date(disabledHours.from);
      }
      if (typeof disabledHours.to === 'string') {
        disabledHours.to = new Date(disabledHours.to);
      }
      const now = new Date().getHours();
      const from = disabledHours.from.getHours();
      let to = disabledHours.to.getHours();
      if (to < from) {
        to += 24; // Because 11h - 1h should be 11h - 25h
      }
      return now >= from && now < to;
    } catch (e) {
      console.error(`Error getting disabled hours for uptime ${uptimeId}`, e);
      return false;
    }
  }
}
