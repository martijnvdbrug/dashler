import {Module} from '@nestjs/common';
import {PaymentService} from './payment.service';
import {PaymentController} from './payment.controller';
import {TeamModule} from '../team/team.module';

@Module({
  imports: [
    TeamModule
  ],
  providers: [
    PaymentService
  ],
  exports: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {
}
