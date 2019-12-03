import {Controller, Post, Req, Res} from '@nestjs/common';
import {PaymentService} from './payment.service';
import {Request, Response} from 'express';

@Controller('payment')
export class PaymentController {

  constructor(
    private paymentService: PaymentService
  ) {
  }

  @Post('stripe-webhook')
  async stripeWebhook(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      await this.paymentService.fullfillPayment(req, res);
    } catch (err) {
      console.error(`Error processing payment`, err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  /*  @Post('test')
    async test(@Req() req: Request, @Res() res: Response): Promise<void> {
      console.log('rawbody', (req as any).rawBody);
      console.log('body', (req as any).rawBody);
      res.sendStatus(200);
    }*/
}
