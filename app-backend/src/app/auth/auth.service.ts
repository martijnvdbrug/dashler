import {Inject, Injectable} from '@nestjs/common';
import {UserEntity} from './model/user.entity';
import {DatastoreClient} from '../../lib/datastore/datastore.client';

@Injectable()
export class AuthService {

  constructor(
    @Inject('UserRepo') private userRepo: DatastoreClient<UserEntity>
  ) {
  }

  /*  createUser(user: UserEntity) {

      this.userRepo.save()
    }*/

}
