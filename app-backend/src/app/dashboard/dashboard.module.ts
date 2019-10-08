import {Module} from '@nestjs/common';
import {DashboardService} from './dashboard.service';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {Dashboard} from '../../lib/shared/graphql-types';
import {DashboardEntity} from './model/dashboard.entity';
import {AuthModule} from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
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
