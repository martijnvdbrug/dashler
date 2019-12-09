import {Module} from '@nestjs/common';
import {DashboardService} from './dashboard.service';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {Dashboard, Uptime} from '../../lib/shared/graphql-types';
import {DashboardEntity} from './model/dashboard.entity';
import {UptimeService} from './uptime.service';
import {TeamModule} from '../team/team.module';

@Module({
  imports: [
    TeamModule
  ],
  providers: [
    DashboardService,
    UptimeService,
    {
      provide: 'DashboardRepo',
      useValue: new DatastoreClient<DashboardEntity>('Dashboard')
    }, {
      provide: 'UptimeRepo',
      useValue: new DatastoreClient<Uptime>('Uptime')
    }
  ],
  exports: [
    DashboardService,
    UptimeService
  ]
})
export class DashboardModule {
}
