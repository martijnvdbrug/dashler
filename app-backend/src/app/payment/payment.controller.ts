import {Controller, Get, Post, Req, Res} from '@nestjs/common';
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
    await this.paymentService.fullfillPayment(req, res);
  }

  @Get('test')
  async test(@Req() req: Request, @Res() res: Response): Promise<void> {
    console.log('Test', (req as any).rawBody);
    res.sendStatus(200);
  }
}
