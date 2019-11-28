import {Injectable} from '@nestjs/common';
import Stripe = require('stripe');
import {CONFIG} from '../../lib/config/config';

@Injectable()
export class PaymentService {

  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(CONFIG.stripeSecret);
  }

  async getSessionId(email: string): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      subscription_data: {
        items: [{
          plan: 'prod_GGM6yHV8GxlXSX',
        }],
      },
      success_url: `${CONFIG.host}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'https://example.com/cancel',
    });
    return session.id;
  }
}
