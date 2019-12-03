export interface StripeCheckoutSession {
  id: string;
  object: string;
  billing_address_collection?: any;
  cancel_url: string;
  client_reference_id?: any;
  customer: string;
  customer_email: string;
  display_items: DisplayItem[];
  livemode: boolean;
  locale?: any;
  mode: string;
  payment_intent?: any;
  payment_method_types: string[];
  setup_intent?: any;
  submit_type?: any;
  subscription: string;
  success_url: string;
}

export interface Plan {
  id: string;
  object: string;
  active: boolean;
  aggregate_usage?: any;
  amount: number;
  amount_decimal: string;
  billing_scheme: string;
  created: number;
  currency: string;
  interval: string;
  interval_count: number;
  livemode: boolean;
  metadata: any;
  nickname: string;
  product: string;
  tiers?: any;
  tiers_mode?: any;
  transform_usage?: any;
  trial_period_days?: any;
  usage_type: string;
}

export interface DisplayItem {
  amount: number;
  currency: string;
  plan: Plan;
  quantity: number;
  type: string;
}
