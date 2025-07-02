'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Sparkles,
  X,
  ChevronDown
} from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const { user, loading } = useAuth();

  const navigationItems = [
    { 
      name: 'Collections', 
      href: '/collections', 
      icon: Gem,
      description: 'Curated jewelry collections'
    },
    { 
      name: 'Vintage', 
      href: '/vintage', 
      icon: Crown,
      description: 'Authentic vintage pieces'
    },
    { 
      name: 'Costume', 
      href: '/costume', 
      icon: Sparkles,
      description: 'Fashion & costume jewelry'
    },
    { 
      name: 'Sell', 
      href: '/sell', 
      icon: null,
      description: 'Sell your jewelry'
    },
    { 
      name: 'About', 
      href: '/about', 
      icon: null,
      description: 'Our story'
    },
  ];

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-warm-gray/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/logo.png"
                alt="VintageVault"
                width={140}
                height={45}
                className="h-10 w-auto transition-transform duration-200 group-hover:scale-105"
                priority
              />
              <div className="hidden lg:block">
                <span className="text-xs text-warm-gray font-medium tracking-wide">
                  Timeless Treasures, Curated with Care
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2 text-sm font-medium text-deep-charcoal hover:text-vintage-gold transition-all duration-200 py-2 px-3 rounded-md hover:bg-soft-champagne/30"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.name}</span>
                  </Link>
                  {item.description && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-deep-charcoal text-cream-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-deep-charcoal rotate-45"></div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative hidden md:block">
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <Input
                      type="text"
                      placeholder="Search jewelry..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 h-9 text-sm border-vintage-gold/30 focus:border-vintage-gold"
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchOpen(false)}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchOpen(true)}
                    className="hover:bg-soft-champagne/30 hover:text-vintage-gold transition-all duration-200"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex hover:bg-soft-champagne/30 hover:text-vintage-gold transition-all duration-200 relative"
                onClick={() => window.location.href = '/wishlist'}
              >
                <Heart className="h-4 w-4" />
                <span className="ml-1 text-xs hidden lg:inline">Wishlist</span>
              </Button>

              {/* Cart */}
              <CartDrawer onCheckout={() => window.location.href = '/checkout'}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:bg-soft-champagne/30 hover:text-vintage-gold transition-all duration-200 px-3"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="ml-1 text-xs hidden lg:inline">Cart</span>
                  {cart.itemCount > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-vintage-gold text-white animate-pulse"
                    >
                      {cart.itemCount}
                    </Badge>
                  )}
                </Button>
              </CartDrawer>

              {/* User Authentication */}
              {loading ? (
                <div className="h-9 w-9 rounded-full bg-soft-champagne animate-pulse"></div>
              ) : user ? (
                <UserProfile />
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openAuthModal('login')}
                    className="hover:bg-soft-champagne/30 hover:text-vintage-gold transition-all duration-200"
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm" 
                    className="btn-primary hover:bg-vintage-gold/90 transition-all duration-200 shadow-sm"
                    onClick={() => openAuthModal('register')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="lg:hidden hover:bg-soft-champagne/30 hover:text-vintage-gold transition-all duration-200"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[400px] bg-cream-white">
                  <div className="flex flex-col space-y-6 mt-6">
                    <div className="flex items-center justify-between">
                      <Link href="/" className="flex items-center space-x-2">
                        <Image
                          src="/logo.png"
                          alt="VintageVault"
                          width={120}
                          height={40}
                          className="h-8 w-auto"
                        />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="Search jewelry..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 border-vintage-gold/30 focus:border-vintage-gold"
                      />
                      <Button type="submit" size="sm" className="btn-primary">
                        <Search className="h-4 w-4" />
                      </Button>
                    </form>
                    
                    {/* Mobile Auth Buttons */}
                    {!user && (
                      <div className="flex flex-col space-y-3 pb-6 border-b border-warm-gray/20">
                        <Button 
                          className="btn-primary w-full"
                          onClick={() => {
                            openAuthModal('register');
                            setIsOpen(false);
                          }}
                        >
                          Sign Up
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full border-vintage-gold text-vintage-gold hover:bg-vintage-gold hover:text-white"
                          onClick={() => {
                            openAuthModal('login');
                            setIsOpen(false);
                          }}
                        >
                          Sign In
                        </Button>
                      </div>
                    )}
                    
                    {/* Mobile Navigation */}
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center space-x-3 text-base font-medium text-deep-charcoal hover:text-vintage-gold hover:bg-soft-champagne/30 transition-all duration-200 py-3 px-4 rounded-lg"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.icon && <item.icon className="h-5 w-5" />}
                          <div>
                            <span>{item.name}</span>
                            {item.description && (
                              <div className="text-xs text-warm-gray mt-1">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    {/* Mobile Quick Actions */}
                    <div className="border-t border-warm-gray/20 pt-6 space-y-2">
                      <Link
                        href="/wishlist"
                        className="flex items-center space-x-3 text-base font-medium text-deep-charcoal hover:text-vintage-gold hover:bg-soft-champagne/30 transition-all duration-200 py-3 px-4 rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        <Heart className="h-5 w-5" />
                        <span>Wishlist</span>
                      </Link>
                      <Link
                        href="/account"
                        className="flex items-center space-x-3 text-base font-medium text-deep-charcoal hover:text-vintage-gold hover:bg-soft-champagne/30 transition-all duration-200 py-3 px-4 rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>My Account</span>
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

