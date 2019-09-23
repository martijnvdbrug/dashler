import {Inject, Injectable} from '@nestjs/common';
import {Dashboard, DashboardInput} from '../../lib/shared/graphql-types';
import {DatastoreClient} from '../../lib/datastore/datastore.client';

@Injectable()
export class DashboardService {

  constructor(
    @Inject('DashboardRepo') private repo: DatastoreClient<Dashboard>
  ) {
  }

  async get(id: string): Promise<Dashboard> {
    return {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Production',
      blocks: []
    };
  }

  async create(input: DashboardInput): Promise<Dashboard> {
    const id = await this.repo.save({
      name: input.name
    });
    return this.get(id);
  }

}
