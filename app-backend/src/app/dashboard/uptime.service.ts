import {ForbiddenException, forwardRef, Inject, Injectable} from '@nestjs/common';
import {BlockInput, Dashboard, DashboardInput, Uptime, UptimeCheckInput} from '../../lib/shared/graphql-types';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {DashboardAdapter} from './dashboard.adapter';
import {DashboardEntity} from './model/dashboard.entity';
import {readableId} from '../../lib/readable-id';
import {UserService} from '../user/user.service';
import {UserEntity} from '../user/model/user.entity';
import {PlanValidator} from '../user/plan.validator';
import normalizeUrl = require('normalize-url');


@Injectable()
export class UptimeService {

  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject('DashboardRepo') private dashboardRepo: DatastoreClient<DashboardEntity>,
    @Inject('UptimeRepo') private uptimeRepo: DatastoreClient<Uptime>
  ) {
  }

  async get(url: string): Promise<Uptime> {
    return this.uptimeRepo.get(url);
  }

  async create(input: UptimeCheckInput): Promise<Uptime> {
    if (await this.uptimeRepo.exists(input.url)) {
      return this.uptimeRepo.get(input.url);
    }
    const id = normalizeUrl(input.url);
    const uptime: Uptime = {
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        checkInterval: Math.ceil(input.interval / 5) * 5,
        webhook: input.webhook,
        disabledHours: input.disabledHours
      }
    ;
    await this.uptimeRepo.save(uptime);
    return this.uptimeRepo.get(id);
  }

  async remove(url: string): Promise<boolean> {
    if (!url) {
      return false;
    }
    await this.uptimeRepo.remove(normalizeUrl(url));
    return true;
  }

}
