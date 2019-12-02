import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {UserEntity} from '../user/model/user.entity';
import { PaymentController } from './payment.controller';

@Module({
  providers: [
    PaymentService
  ],
  exports: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
