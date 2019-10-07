import {Module} from '@nestjs/common';
import {DashboardResolver} from './dashboard.resolver';
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
    DashboardResolver,
    DashboardService,
    {
      provide: 'DashboardRepo',
      useValue: new DatastoreClient<DashboardEntity>('Dashboard')
    }
  ]
})
export class DashboardModule {
}
