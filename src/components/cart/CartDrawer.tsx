'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CartItem, useCart } from '@/lib/cart';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  X,
  Gem,
  Crown,
  Sparkles,
  CreditCard
} from 'lucide-react';

interface CartDrawerProps {
  children: React.ReactNode;
  onCheckout?: () => void;
}

const CartDrawer = ({ children, onCheckout }: CartDrawerProps) => {
  const { cart, removeItem, updateQuantity, clear } = useCart();

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

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const CartItemComponent = ({ item }: { item: CartItem }) => {
    const CategoryIcon = getCategoryIcon(item.product.category);

    return (
      <div className="flex items-center space-x-3 py-4 border-b border-gray-100 last:border-b-0">
        {/* Product Image */}
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-soft-champagne to-vintage-gold/10 rounded-lg flex items-center justify-center relative">
          <CategoryIcon className="h-6 w-6 text-vintage-gold/50" />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-deep-charcoal truncate">
            {item.product.title}
          </h4>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline" className="text-xs capitalize">
              {item.product.category}
            </Badge>
            {item.product.era && (
              <span className="text-xs text-warm-gray">{item.product.era}</span>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-semibold text-deep-charcoal">
              ${item.product.price}
            </span>
            
            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0"
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium w-8 text-center">
                {item.quantity}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0"
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Shopping Cart</span>
            {cart.itemCount > 0 && (
              <Badge variant="secondary">{cart.itemCount}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-12 w-12 text-warm-gray mb-4" />
                <h3 className="text-lg font-medium text-deep-charcoal mb-2">
                  Your cart is empty
                </h3>
                <p className="text-warm-gray mb-4">
                  Add some beautiful jewelry pieces to get started
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {cart.items.map((item) => (
                  <CartItemComponent key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cart.items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              {/* Clear Cart */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-warm-gray">
                  {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="text-red-500 hover:text-red-700"
                >
                  Clear Cart
                </Button>
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Subtotal:</span>
                  <span className="font-medium">${cart.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Tax:</span>
                  <span className="font-medium">${cart.tax}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Shipping:</span>
                  <span className="font-medium">
                    {cart.shipping === 0 ? 'Free' : `$${cart.shipping}`}
                  </span>
                </div>
                {cart.subtotal < 100 && cart.subtotal > 0 && (
                  <div className="text-xs text-vintage-gold bg-vintage-gold/10 p-2 rounded">
                    Add ${(100 - cart.subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>${cart.total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                className="w-full btn-primary"
                onClick={onCheckout}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-warm-gray">
                <div>
                  <div className="h-6 w-6 mx-auto mb-1 bg-vintage-gold/10 rounded-full flex items-center justify-center">
                    🔒
                  </div>
                  Secure Payment
                </div>
                <div>
                  <div className="h-6 w-6 mx-auto mb-1 bg-vintage-gold/10 rounded-full flex items-center justify-center">
                    🚚
                  </div>
                  Fast Shipping
                </div>
                <div>
                  <div className="h-6 w-6 mx-auto mb-1 bg-vintage-gold/10 rounded-full flex items-center justify-center">
                    ↩️
                  </div>
                  Easy Returns
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;

