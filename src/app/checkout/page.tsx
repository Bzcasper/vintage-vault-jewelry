'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const CheckoutPage = () => {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePaymentSuccess = (intentId: string) => {
    setPaymentIntentId(intentId);
    setPaymentStatus('success');
  };

  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
    setPaymentStatus('error');
  };

  if (paymentStatus === 'success') {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-serif font-bold text-deep-charcoal mb-4">
                  Payment Successful!
                </h1>
                <p className="text-lg text-warm-gray mb-6">
                  Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-warm-gray">
                    <strong>Payment ID:</strong> {paymentIntentId}
                  </p>
                  <p className="text-sm text-warm-gray mt-1">
                    You will receive an email confirmation shortly with your order details and tracking information.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => router.push('/collections')}
                    variant="outline"
                  >
                    Continue Shopping
                  </Button>
                  <Button 
                    onClick={() => router.push('/account/orders')}
                    className="btn-primary"
                  >
                    View Orders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-red-500 text-2xl">✕</span>
                </div>
                <h1 className="text-3xl font-serif font-bold text-deep-charcoal mb-4">
                  Payment Failed
                </h1>
                <p className="text-lg text-warm-gray mb-6">
                  {errorMessage || 'There was an issue processing your payment. Please try again.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => setPaymentStatus('pending')}
                    className="btn-primary"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => router.push('/cart')}
                    variant="outline"
                  >
                    Back to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-deep-charcoal mb-2">
            Checkout
          </h1>
          <p className="text-lg text-warm-gray">
            Complete your purchase securely with our encrypted checkout process.
          </p>
        </div>

        {/* Checkout Form */}
        <CheckoutForm
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />

        {/* Trust Indicators */}
        <div className="mt-12 border-t pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-vintage-gold/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-vintage-gold text-xl">🔒</span>
              </div>
              <h3 className="font-medium text-deep-charcoal mb-1">Secure Payment</h3>
              <p className="text-sm text-warm-gray">
                Your payment information is encrypted and secure
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-vintage-gold/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-vintage-gold text-xl">🚚</span>
              </div>
              <h3 className="font-medium text-deep-charcoal mb-1">Fast Shipping</h3>
              <p className="text-sm text-warm-gray">
                Free shipping on orders over $100
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-vintage-gold/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-vintage-gold text-xl">↩️</span>
              </div>
              <h3 className="font-medium text-deep-charcoal mb-1">Easy Returns</h3>
              <p className="text-sm text-warm-gray">
                30-day return policy on all items
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;

