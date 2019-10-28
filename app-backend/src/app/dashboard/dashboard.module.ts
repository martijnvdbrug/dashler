import {Module} from '@nestjs/common';
import {DashboardService} from './dashboard.service';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {Dashboard, Uptime} from '../../lib/shared/graphql-types';
import {DashboardEntity} from './model/dashboard.entity';
import {UserModule} from '../user/user.module';
import {UptimeService} from './uptime.service';

@Module({
  imports: [
    UserModule
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
    DashboardService
  ]
})
export class DashboardModule {
}
