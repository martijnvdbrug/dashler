import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {GoogleStrategy} from './google.strategy';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {UserEntity} from './model/user.entity';
import {UserService} from './user.service';

@Module({
  controllers: [AuthController],
  providers: [
    UserService,
    UserService,
    GoogleStrategy,
    {
      provide: 'UserRepo',
      useValue: new DatastoreClient<UserEntity>('User')
    }
  ],
  exports: [
    UserService,
    UserService
  ]
})
export class UserModule {
}
