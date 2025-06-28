'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import CartDrawer from '@/components/cart/CartDrawer';
import { useCart } from '@/lib/cart';
import AuthModal from '@/components/auth/AuthModal';
import UserProfile from '@/components/auth/UserProfile';
import { useAuth } from '@/lib/auth';
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  User, 
  Heart,
  Gem,
  Crown,
  Sparkles
} from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { cart } = useCart();
  const { user, loading } = useAuth();

  const navigationItems = [
    { name: 'Collections', href: '/collections', icon: Gem },
    { name: 'Vintage', href: '/vintage', icon: Crown },
    { name: 'Costume', href: '/costume', icon: Sparkles },
    { name: 'Sell', href: '/sell', icon: null },
    { name: 'About', href: '/about', icon: null },
  ];

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="VintageVault"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-sm font-medium text-deep-charcoal hover:text-vintage-gold transition-colors duration-200"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Search className="h-4 w-4" />
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Heart className="h-4 w-4" />
              </Button>

              {/* Cart */}
              <CartDrawer onCheckout={() => window.location.href = '/checkout'}>
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {cart.itemCount > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-vintage-gold text-white"
                    >
                      {cart.itemCount}
                    </Badge>
                  )}
                </Button>
              </CartDrawer>

              {/* User Authentication */}
              {loading ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : user ? (
                <UserProfile />
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openAuthModal('login')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm" 
                    className="btn-primary"
                    onClick={() => openAuthModal('register')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    <Link href="/" className="flex items-center space-x-2 mb-8">
                      <Image
                        src="/logo.png"
                        alt="VintageVault"
                        width={120}
                        height={40}
                        className="h-8 w-auto"
                      />
                    </Link>
                    
                    {/* Mobile Auth Buttons */}
                    {!user && (
                      <div className="flex flex-col space-y-2 mb-6">
                        <Button 
                          className="btn-primary"
                          onClick={() => {
                            openAuthModal('register');
                            setIsOpen(false);
                          }}
                        >
                          Sign Up
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            openAuthModal('login');
                            setIsOpen(false);
                          }}
                        >
                          Sign In
                        </Button>
                      </div>
                    )}
                    
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 text-lg font-medium text-deep-charcoal hover:text-vintage-gold transition-colors duration-200 py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon && <item.icon className="h-5 w-5" />}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    
                    <div className="border-t pt-4 mt-8">
                      <Link
                        href="/search"
                        className="flex items-center space-x-3 text-lg font-medium text-deep-charcoal hover:text-vintage-gold transition-colors duration-200 py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <Search className="h-5 w-5" />
                        <span>Search</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        className="flex items-center space-x-3 text-lg font-medium text-deep-charcoal hover:text-vintage-gold transition-colors duration-200 py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <Heart className="h-5 w-5" />
                        <span>Wishlist</span>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
};

export default Header;

