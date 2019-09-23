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
    const result = await this.repo.get(id);
    return result;
  }

  async create(input: DashboardInput): Promise<Dashboard> {
    const id = await this.repo.save({
      name: input.name
    });
    console.log('IDD', id);
    return this.get(id);
  }

}
