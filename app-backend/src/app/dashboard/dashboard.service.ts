import {ForbiddenException, forwardRef, Inject, Injectable} from '@nestjs/common';
import {BlockInput, Dashboard, DashboardInput} from '../../lib/shared/graphql-types';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {DashboardAdapter} from './dashboard.adapter';
import {DashboardEntity} from './model/dashboard.entity';
import {readableId} from '../../lib/readable-id';
import {UserService} from '../user/user.service';
import {UserEntity} from '../user/model/user.entity';
import {MaxBlocksException} from './max-blocks.exception';


@Injectable()
export class DashboardService {

  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject('DashboardRepo') private repo: DatastoreClient<DashboardEntity>
  ) {
  }

  /**
   * Gets dashboard by id. Validates if it belongs to email if an emailAddress is given.
   */
  async get(id: string, email?: string): Promise<DashboardEntity> {
    const dashboard = await this.repo.get(id);
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
    return this.repo.get(user.dashboardIds[0]);
  }

  async getForUser(email: string): Promise<Dashboard[]> {
    const user = await this.userService.get(email);
    return await this.repo.getMultiple(user.dashboardIds);
  }

  async create(input: DashboardInput, email: string): Promise<DashboardEntity> {
    const id = readableId(input.name);
    await Promise.all([
      this.repo.save({
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
    if (dashboard.blocks.length >= plan.maxBlocks) {
      throw new MaxBlocksException(`You are only allowed to have ${plan.maxBlocks} blocks in you dashboard.`);
    }
    dashboard.blocks.push(DashboardAdapter.toBlock(input));
    await this.repo.save(dashboard);
    return dashboard;
  }

  async removeBlock(dashboardId: string, blockId: string): Promise<DashboardEntity> {
    const dashboard = await this.get(dashboardId);
    if (Array.isArray(dashboard.blocks)) {
      dashboard.blocks = dashboard.blocks.filter(block => block.id !== blockId);
      await this.repo.save(dashboard);
    }
    return dashboard;
  }

}
