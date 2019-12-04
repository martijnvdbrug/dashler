import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {UserService} from '../../providers/user.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'payment-page',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss']
})
export class PaymentPage implements OnInit {

  success: boolean = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
  }

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const success = params.get('success');
      if (success === 'success') {
        this.success = true;
        setTimeout(() => this.router.navigate(['/dashboard']), 5000);
      } else if (success === 'failure') {
        this.success = false;
      } else {
        this.success = undefined;
        this.redirectToStripe();
      }
    });
  }

  async redirectToStripe(): Promise<void> {
    const [sessionId] = await Promise.all([
      this.userService.getStripeSessionId(),
      this.loadScript('https://js.stripe.com/v3/')
    ]);
    console.log('resolvee');
    const stripe = (window as any).Stripe(environment.stripePK);
    stripe.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId
    }).then((result) => {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
      if (result.error) {
        console.error(result.error.message);
      }
    });
  }

  loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script') as any;
      script.type = 'text/javascript';
      script.src = src;
      if (script.readyState) {
        script.onreadystatechange = () => {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;
            resolve();
          }
        };
      } else {
        script.onload = () => {
          resolve();
        };
      }
      script.onerror = (error: any) => reject(error);
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }

}
