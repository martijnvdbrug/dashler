import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {GoogleStrategy} from './google.strategy';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {UserEntity} from './model/user.entity';
import {UserService} from './user.service';
import {DashboardModule} from '../dashboard/dashboard.module';

@Module({
  imports: [
    forwardRef(() => DashboardModule)
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    GoogleStrategy,
    {
      provide: 'UserRepo',
      useValue: new DatastoreClient<UserEntity>('User')
    }
  ],
  exports: [
    UserService,
  ]
})
export class UserModule {
}
