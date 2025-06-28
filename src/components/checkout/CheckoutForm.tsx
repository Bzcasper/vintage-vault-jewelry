'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/lib/cart';
import { 
  CreditCard, 
  Lock, 
  User, 
  MapPin, 
  Mail, 
  Phone,
  Gem,
  Crown,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CheckoutFormProps {
  onPaymentSuccess?: (paymentIntentId: string) => void;
  onPaymentError?: (error: string) => void;
}

const CheckoutForm = ({ onPaymentSuccess, onPaymentError }: CheckoutFormProps) => {
  const { cart, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const [billingInfo, setBillingInfo] = useState({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vintage':
        return Crown;
      case 'designer':
        return Gem;
      case 'costume':
        return Sparkles;
      default:
        return Gem;
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingInfo()) {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePaymentInfo()) {
      setStep('review');
    }
  };

  const validateShippingInfo = () => {
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    return required.every(field => shippingInfo[field as keyof typeof shippingInfo].trim() !== '');
  };

  const validatePaymentInfo = () => {
    const required = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
    return required.every(field => paymentInfo[field as keyof typeof paymentInfo].trim() !== '');
  };

  const handleFinalSubmit = async () => {
    if (!agreeToTerms) {
      onPaymentError?.('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    
    try {
      // In a real implementation, this would integrate with Stripe
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPaymentIntentId = `pi_${Date.now()}`;
      clear(); // Clear the cart
      onPaymentSuccess?.(mockPaymentIntentId);
    } catch (error) {
      onPaymentError?.('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-warm-gray mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-deep-charcoal mb-2">
          Your cart is empty
        </h2>
        <p className="text-warm-gray">
          Add some items to your cart before proceeding to checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center space-x-4 mb-8">
          {['shipping', 'payment', 'review'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === stepName 
                  ? 'bg-vintage-gold text-white' 
                  : index < ['shipping', 'payment', 'review'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {index < ['shipping', 'payment', 'review'].indexOf(step) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={`ml-2 text-sm font-medium capitalize ${
                step === stepName ? 'text-vintage-gold' : 'text-gray-600'
              }`}>
                {stepName}
              </span>
              {index < 2 && <div className="w-8 h-px bg-gray-200 ml-4" />}
            </div>
          ))}
        </div>

        {/* Shipping Information */}
        {step === 'shipping' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Shipping Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <select
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
                
                <Button type="submit" className="w-full btn-primary">
                  Continue to Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Payment Information */}
        {step === 'payment' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Information</span>
                <Lock className="h-4 w-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    value={paymentInfo.cardholderName}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(e.target.value)})}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: formatExpiryDate(e.target.value)})}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/\D/g, '')})}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameAsShipping"
                    checked={billingInfo.sameAsShipping}
                    onCheckedChange={(checked) => setBillingInfo({...billingInfo, sameAsShipping: !!checked})}
                  />
                  <Label htmlFor="sameAsShipping">Billing address same as shipping</Label>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('shipping')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 btn-primary">
                    Review Order
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Order Review */}
        {step === 'review' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Review Your Order</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Shipping Summary */}
              <div>
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <div className="text-sm text-warm-gray">
                  <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                  <p>{shippingInfo.email}</p>
                </div>
              </div>
              
              {/* Payment Summary */}
              <div>
                <h4 className="font-medium mb-2">Payment Method</h4>
                <div className="text-sm text-warm-gray">
                  <p>**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                  <p>{paymentInfo.cardholderName}</p>
                </div>
              </div>
              
              {/* Terms Agreement */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the <a href="/terms" className="text-vintage-gold hover:underline">Terms of Service</a> and <a href="/privacy" className="text-vintage-gold hover:underline">Privacy Policy</a>
                </Label>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep('payment')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleFinalSubmit}
                  disabled={!agreeToTerms || loading}
                  className="flex-1 btn-primary"
                >
                  {loading ? 'Processing...' : `Pay $${cart.total}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Summary */}
      <div className="lg:sticky lg:top-20 h-fit">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cart Items */}
            <div className="space-y-3">
              {cart.items.map((item) => {
                const CategoryIcon = getCategoryIcon(item.product.category);
                return (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-soft-champagne to-vintage-gold/10 rounded-lg flex items-center justify-center">
                      <CategoryIcon className="h-5 w-5 text-vintage-gold/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.product.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">{item.product.category}</Badge>
                        <span className="text-xs text-warm-gray">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium">${item.product.price * item.quantity}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${cart.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>${cart.tax}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>{cart.shipping === 0 ? 'Free' : `$${cart.shipping}`}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total:</span>
                <span>${cart.total}</span>
              </div>
            </div>
            
            {/* Security Badges */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-center space-x-4 text-xs text-warm-gray">
                <div className="flex items-center space-x-1">
                  <Lock className="h-3 w-3" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CreditCard className="h-3 w-3" />
                  <span>Stripe Protected</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;

