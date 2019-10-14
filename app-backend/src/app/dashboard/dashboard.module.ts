import {Module} from '@nestjs/common';
import {DashboardService} from './dashboard.service';
import {DatastoreClient} from '../../lib/shared/datastore/datastore.client';
import {Dashboard} from '../../lib/shared/graphql-types';
import {DashboardEntity} from './model/dashboard.entity';
import {UserModule} from '../user/user.module';

@Module({
  imports: [
    UserModule
  ],
  providers: [
    DashboardService,
    {
      provide: 'DashboardRepo',
      useValue: new DatastoreClient<DashboardEntity>('Dashboard')
    }
  ],
  exports: [
    DashboardService
  ]
})
export class DashboardModule {
}
