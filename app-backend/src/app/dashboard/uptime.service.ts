import {Inject, Injectable} from '@nestjs/common';
import {Uptime, UptimeCheckInput} from '../../lib/shared/graphql-types';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {DashboardEntity} from './model/dashboard.entity';
import {readableId} from '../../lib/readable-id';
import normalizeUrl = require('normalize-url');


@Injectable()
export class UptimeService {

  constructor(
    @Inject('DashboardRepo') private dashboardRepo: DatastoreClient<DashboardEntity>,
    @Inject('UptimeRepo') private uptimeRepo: DatastoreClient<Uptime>
  ) {
  }

  async get(id: string): Promise<Uptime> {
    return this.uptimeRepo.get(id);
  }

  async upsert(input: UptimeCheckInput, uptimeId?: string): Promise<Uptime> {
    const url = normalizeUrl(input.url);
    const id = uptimeId ? uptimeId : readableId(url);
    const uptime: Uptime = {
        id,
        url,
        checkInterval: Math.ceil(input.interval / 5) * 5,
        webhook: input.webhook,
        disabledHours: input.disabledHours
      }
    ;
    await this.uptimeRepo.save(uptime);
    return this.uptimeRepo.get(id);
  }

  async remove(id: string): Promise<boolean> {
    if (!id) {
      return false;
    }
    await this.uptimeRepo.remove(id);
    return true;
  }

}
