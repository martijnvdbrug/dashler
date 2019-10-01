import {Inject, Injectable} from '@nestjs/common';
import {Dashboard, DashboardInput, BlockInput} from '../../lib/shared/graphql-types';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {DashboardAdapter} from './dashboard.adapter';

@Injectable()
export class DashboardService {

  constructor(
    @Inject('DashboardRepo') private repo: DatastoreClient<Dashboard>
  ) {
  }

  async get(id: string): Promise<Dashboard> {
    const dashboard = await this.repo.get(id);
    if (!dashboard) {
      throw Error(`Dashboard ${id} not found.`);
    }
    return dashboard;
  }

  async create(input: DashboardInput): Promise<Dashboard> {
    const id = await this.repo.save({
      name: input.name
    });
    return this.get(id);
  }

  async addBlock(dashboardId: string, input: BlockInput): Promise<Dashboard> {
    const dashboard = await this.get(dashboardId);
    if (!Array.isArray(dashboard.blocks)) {
      dashboard.blocks = [];
    }
    dashboard.blocks.push(DashboardAdapter.toBlock(input));
    await this.repo.save(dashboard);
    return dashboard;
  }

  async removeBlock(dashboardId: string, blockId: string): Promise<Dashboard> {
    const dashboard = await this.get(dashboardId);
    if (Array.isArray(dashboard.blocks)) {
      dashboard.blocks = dashboard.blocks.filter(block => block.id !== blockId);
      await this.repo.save(dashboard);
    }
    return dashboard;
  }

}
