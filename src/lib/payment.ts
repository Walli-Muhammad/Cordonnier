// =============================================
// WALIM LTD - Modular Payment Provider Architecture
// Abstract Payment Gateway Interface
// =============================================

export interface PaymentIntentInput {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, any>;
}

export interface PaymentIntentResult {
  success: boolean;
  transactionRef: string;
  checkoutUrl?: string;
  status: 'pending' | 'completed' | 'failed';
  message: string;
  provider: string;
  isTestMode: boolean;
}

export interface PaymentProvider {
  name: string;
  isConfigured: boolean;
  createPaymentIntent(input: PaymentIntentInput): Promise<PaymentIntentResult>;
  verifyPayment(transactionRef: string): Promise<boolean>;
}

// =============================================
// Development / Test Payment Provider Implementation
// Safe test mode when live gateway credentials are not present
// =============================================

export class TestModePaymentProvider implements PaymentProvider {
  name = 'WALIM Test Payment Gateway';
  isConfigured = true;

  async createPaymentIntent(input: PaymentIntentInput): Promise<PaymentIntentResult> {
    const txnRef = `TEST_TXN_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return {
      success: true,
      transactionRef: txnRef,
      status: 'completed',
      message: 'Test payment simulation completed successfully. No real charge was processed.',
      provider: 'TestModeProvider',
      isTestMode: true,
    };
  }

  async verifyPayment(transactionRef: string): Promise<boolean> {
    return transactionRef.startsWith('TEST_TXN_');
  }
}

// Factory helper to get active payment provider
export function getPaymentProvider(): PaymentProvider {
  // Can be extended to inspect process.env.STRIPE_SECRET_KEY, process.env.PAYPAL_CLIENT_ID, etc.
  return new TestModePaymentProvider();
}
