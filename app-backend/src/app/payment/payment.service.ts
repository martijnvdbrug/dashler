import {Injectable} from '@nestjs/common';
import Stripe = require('stripe');
import {CONFIG} from '../../lib/config/config';
import {Request, Response} from 'express';

@Injectable()
export class PaymentService {

  private readonly stripe: Stripe;

  constructor() {
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
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(req.body, sig, CONFIG.stripeWebhookSecret);
    } catch (err) {
      console.error(`Error processing payment`, err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('SESSIONN', JSON.stringify(session));
    }
    res.json({received: true});
  }
}
