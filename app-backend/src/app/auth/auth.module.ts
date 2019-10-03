import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {GoogleStrategy} from './google.strategy';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {UserEntity} from './model/user.entity';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    {
      provide: 'UserRepo',
      useValue: new DatastoreClient<UserEntity>('User')
    }
  ]
})
export class AuthModule {}
