'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail,
  Phone,
  MapPin,
  Shield,
  Truck,
  RotateCcw,
  CreditCard
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-deep-charcoal text-cream-white">
      {/* Trust Badges Section */}
      <div className="border-b border-warm-gray/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Shield className="h-8 w-8 text-vintage-gold" />
              <h3 className="font-semibold">Authenticated</h3>
              <p className="text-sm text-warm-gray">Every piece verified</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Truck className="h-8 w-8 text-vintage-gold" />
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-warm-gray">On orders over $100</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <RotateCcw className="h-8 w-8 text-vintage-gold" />
              <h3 className="font-semibold">Easy Returns</h3>
              <p className="text-sm text-warm-gray">30-day return policy</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <CreditCard className="h-8 w-8 text-vintage-gold" />
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-sm text-warm-gray">SSL encrypted checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="VintageVault"
                width={120}
                height={40}
                className="h-8 w-auto filter brightness-0 invert"
              />
            </Link>
            <p className="text-warm-gray text-sm leading-relaxed">
              Timeless treasures, curated with care. Discover authentic vintage and pre-owned jewelry that tells a story.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-warm-gray hover:text-vintage-gold">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-warm-gray hover:text-vintage-gold">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-warm-gray hover:text-vintage-gold">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-vintage-gold">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Collections', href: '/collections' },
                { name: 'Vintage Jewelry', href: '/vintage' },
                { name: 'Costume Jewelry', href: '/costume' },
                { name: 'Sell Your Jewelry', href: '/sell' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-warm-gray hover:text-vintage-gold transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-vintage-gold">Customer Service</h3>
            <ul className="space-y-2">
              {[
                { name: 'Shipping Info', href: '/shipping' },
                { name: 'Returns & Exchanges', href: '/returns' },
                { name: 'Size Guide', href: '/size-guide' },
                { name: 'Care Instructions', href: '/care' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Privacy Policy', href: '/privacy' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-warm-gray hover:text-vintage-gold transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-vintage-gold">Stay Connected</h3>
            <p className="text-warm-gray text-sm">
              Subscribe to our newsletter for exclusive offers and new arrivals.
            </p>
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="bg-warm-gray/10 border-warm-gray/20 text-cream-white placeholder:text-warm-gray"
              />
              <Button className="w-full btn-primary">
                Subscribe
              </Button>
            </div>
            
            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2 text-sm text-warm-gray">
                <Mail className="h-4 w-4" />
                <span>hello@vintagevault.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-warm-gray">
                <Phone className="h-4 w-4" />
                <span>1-800-VINTAGE</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-warm-gray">
                <MapPin className="h-4 w-4" />
                <span>New York, NY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-warm-gray/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-warm-gray text-sm">
              © 2024 VintageVault. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-warm-gray">
              <Link href="/terms" className="hover:text-vintage-gold transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-vintage-gold transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="hover:text-vintage-gold transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

