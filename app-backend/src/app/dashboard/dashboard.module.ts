import { Module } from '@nestjs/common';
import {DashboardResolver} from './dashboard.resolver';
import { DashboardService } from './dashboard.service';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {Dashboard} from '../../lib/shared/graphql-types';

@Module({
  providers: [
    DashboardResolver,
    DashboardService,
    {
      provide: 'DashboardRepo',
      useValue: new DatastoreClient<Dashboard>('Dashboard')
    }
  ]
})
export class DashboardModule {}
