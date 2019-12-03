import {Injectable} from '@nestjs/common';
import {CONFIG} from '../../lib/config/config';
import {Request, Response} from 'express';
import {StripeCheckoutSession} from './model/stripe-checkout-session';
import {UserService} from '../user/user.service';
import Stripe = require('stripe');

@Injectable()
export class PaymentService {

  private readonly stripe: Stripe;

  constructor(
    private userService: UserService
  ) {
    this.stripe = new Stripe(CONFIG.stripeSecret);
  }

  async getSessionId(customerEmail: string): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      customer_email: customerEmail,
      payment_method_types: ['card'],
      subscription_data: {
        items: [{
          plan: CONFIG.stripePROPlan, // PRO plan
        }],
      },
      success_url: `${CONFIG.host}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CONFIG.host}/payment/failure`,
    });
    return session.id;
  }

  async fullfillPayment(req: Request, res: Response): Promise<unknown> {
    const sig = req.headers['stripe-signature'];
    const event = this.stripe.webhooks.constructEvent((req as any).rawBody, sig, CONFIG.stripeWebhookSecret);
    if (event.type !== 'checkout.session.completed') {
      return res.json({received: true});
    }
    const session = event.data.object as StripeCheckoutSession;
    if (!session.display_items[0].plan.livemode) {
      console.log(`Accepted TEST payment for ${session.customer_email}`);
    }
    await this.userService.upgradeToPROPlan(session.customer_email);
    console.log(`Upgraded to PRO: ${session.customer_email}`);
    res.json({received: true});
  }
}
