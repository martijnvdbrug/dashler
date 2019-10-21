import {ForbiddenException, forwardRef, Inject, Injectable} from '@nestjs/common';
import {BlockInput, Dashboard, DashboardInput, Uptime, UptimeCheckInput} from '../../lib/shared/graphql-types';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {DashboardAdapter} from './dashboard.adapter';
import {DashboardEntity} from './model/dashboard.entity';
import {readableId} from '../../lib/readable-id';
import {UserService} from '../user/user.service';
import {UserEntity} from '../user/model/user.entity';
import normalizeUrl = require('normalize-url');
import {PlanValidator} from './plan.validator';


@Injectable()
export class DashboardService {

  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject('DashboardRepo') private dashboardRepo: DatastoreClient<DashboardEntity>,
    @Inject('UptimeRepo') private uptimeRepo: DatastoreClient<Uptime>
  ) {
  }

  /**
   * Gets dashboard by id. Validates if it belongs to email if an emailAddress is given.
   */
  async get(id: string, email?: string): Promise<DashboardEntity> {
    const dashboard = await this.dashboardRepo.get(id);
    if (!dashboard) {
      throw Error(`Dashboard ${id} not found.`);
    }
    if (!email) {
      return dashboard;
    }
    if (dashboard.users && dashboard.users.indexOf(email) > -1) {
      return dashboard;
    }
    throw new ForbiddenException(`You are not allowed to view this dashboard`);
  }

  async getFirstForUser(email: string): Promise<DashboardEntity> {
    const user = await this.userService.get(email);
    return this.dashboardRepo.get(user.dashboardIds[0]);
  }

  async getForUser(email: string): Promise<Dashboard[]> {
    const user = await this.userService.get(email);
    return await this.dashboardRepo.getMultiple(user.dashboardIds);
  }

  async create(input: DashboardInput, email: string): Promise<DashboardEntity> {
    const id = readableId(input.name);
    await Promise.all([
      this.dashboardRepo.save({
        id,
        name: input.name,
        users: [email]
      }),
      this.userService.addDashboard(email, id)
    ]);
    return this.get(id);
  }

  async addBlock(dashboardId: string, input: BlockInput, email: string): Promise<DashboardEntity> {
    const [{plan}, dashboard]: [UserEntity, DashboardEntity] = await Promise.all([
      this.userService.get(email),
      this.get(dashboardId)
    ]);
    if (!Array.isArray(dashboard.blocks)) {
      dashboard.blocks = [];
    }
    PlanValidator.validateBlocks(dashboard.blocks, plan);
    let createUptimePromise;
    if (input.uptimecheck) {
      PlanValidator.validateUptime(input.uptimecheck, plan);
      createUptimePromise = this.createUptime(input.uptimecheck);
    }
    dashboard.blocks.push(DashboardAdapter.toBlock(input));
    await Promise.all([
      createUptimePromise,
      this.dashboardRepo.save(dashboard)
    ]);
    return dashboard;
  }

  async addUser(dashboardId: string, emailToAdd: string, loggedInUserEmail: string): Promise<DashboardEntity> {
    const [{plan}, dashboard]: [UserEntity, DashboardEntity] = await Promise.all([
      this.userService.get(loggedInUserEmail),
      this.get(dashboardId)
    ]);
    if (!Array.isArray(dashboard.users)) {
      dashboard.users = [];
    }
    PlanValidator.validateMembers(dashboard.users, plan);
    dashboard.users.push(emailToAdd);
    await this.dashboardRepo.save(dashboard);
    return dashboard;
  }

  async removeBlock(dashboardId: string, blockId: string): Promise<DashboardEntity> {
    const dashboard = await this.get(dashboardId);
    if (!Array.isArray(dashboard.blocks)) {
      return dashboard;
    }
    const block = dashboard.blocks.find(b => b.id === blockId);
    if (block) {
      await this.removeUptime(block.url);
    }
    dashboard.blocks = dashboard.blocks.filter(b => b.id !== blockId);
    await this.dashboardRepo.save(dashboard);
    return dashboard;
  }

  async createUptime(input: UptimeCheckInput): Promise<Uptime> {
    if (await this.uptimeRepo.exists(input.url)) {
      return this.uptimeRepo.get(input.url);
    }
    const uptime: Uptime = {
      id: normalizeUrl(input.url),
      createdAt: new Date(),
      updatedAt: new Date(),
      checkInterval: input.interval,
      webhook: input.url,
      disabledHours: input.disabledHours
    };
    await this.uptimeRepo.save(uptime);
    return undefined;
  }

  async removeUptime(url: string): Promise<boolean> {
    if (!url) {
      return false;
    }
    await this.uptimeRepo.remove(normalizeUrl(url));
    return true;
  }

}
