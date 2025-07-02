'use client';

import React, { useState } from 'react';
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
  CreditCard,
  Gem,
  Crown,
  Sparkles,
  Award,
  Clock,
  Globe,
  Youtube,
  Linkedin,
  MessageCircle
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Simulate newsletter subscription
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const trustBadges = [
    {
      icon: Shield,
      title: "Authenticated",
      description: "Every piece verified for authenticity",
      color: "text-vintage-gold"
    },
    {
      icon: Award,
      title: "Expert Curation",
      description: "Hand-selected by jewelry experts",
      color: "text-rose-gold"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $100 worldwide",
      color: "text-vintage-gold"
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day hassle-free returns",
      color: "text-rose-gold"
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "SSL encrypted & PCI compliant",
      color: "text-vintage-gold"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Expert help when you need it",
      color: "text-rose-gold"
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/vintagevault', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/vintagevault', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/vintagevault', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com/vintagevault', label: 'YouTube' },
    { icon: Linkedin, href: 'https://linkedin.com/company/vintagevault', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gradient-to-b from-deep-charcoal to-black text-cream-white">
      {/* Trust Badges Section */}
      <div className="border-b border-vintage-gold/10 bg-deep-charcoal/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold text-vintage-gold mb-2">
              Why Choose VintageVault?
            </h2>
            <p className="text-warm-gray max-w-2xl mx-auto">
              Your trusted partner for authentic vintage and pre-owned jewelry with unmatched quality and service.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {trustBadges.map((badge, index) => (
              <div 
                key={index}
                className="flex flex-col items-center space-y-3 p-4 rounded-lg hover:bg-vintage-gold/5 transition-all duration-300 group"
              >
                <badge.icon className={`h-10 w-10 ${badge.color} group-hover:scale-110 transition-transform duration-300`} />
                <h3 className="font-semibold text-center group-hover:text-vintage-gold transition-colors duration-300">
                  {badge.title}
                </h3>
                <p className="text-xs text-warm-gray text-center leading-relaxed">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/logo.png"
                alt="VintageVault"
                width={140}
                height={45}
                className="h-10 w-auto filter brightness-0 invert group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <p className="text-warm-gray text-sm leading-relaxed pr-4">
              <span className="text-vintage-gold font-medium">Timeless treasures, curated with care.</span>
              <br />
              Discover authentic vintage and pre-owned jewelry that tells a story. Each piece in our collection 
              is carefully authenticated and curated by our jewelry experts, ensuring you receive only the finest 
              vintage treasures with proven provenance and lasting value.
            </p>
            
            {/* Social Media Links */}
            <div className="space-y-4">
              <h4 className="font-serif text-vintage-gold font-semibold">Follow Our Journey</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-warm-gray/10 border border-warm-gray/20 text-warm-gray hover:text-vintage-gold hover:bg-vintage-gold/10 hover:border-vintage-gold/30 transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-vintage-gold flex items-center">
              <Gem className="h-5 w-5 mr-2" />
              Shop
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'All Collections', href: '/collections', icon: Gem },
                { name: 'Vintage Rings', href: '/vintage/rings', icon: Crown },
                { name: 'Antique Necklaces', href: '/vintage/necklaces', icon: Sparkles },
                { name: 'Estate Jewelry', href: '/estate', icon: Award },
                { name: 'Costume Jewelry', href: '/costume', icon: Sparkles },
                { name: 'New Arrivals', href: '/new-arrivals', icon: Clock },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="flex items-center space-x-2 text-warm-gray hover:text-vintage-gold transition-all duration-200 text-sm group"
                  >
                    <link.icon className="h-3 w-3 group-hover:scale-110 transition-transform duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Support */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-vintage-gold flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Sell Your Jewelry', href: '/sell' },
                { name: 'Authentication Process', href: '/authentication' },
                { name: 'Jewelry Appraisal', href: '/appraisal' },
                { name: 'Size Guide', href: '/size-guide' },
                { name: 'Care Instructions', href: '/care' },
                { name: 'Shipping & Returns', href: '/shipping' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-warm-gray hover:text-vintage-gold transition-all duration-200 text-sm hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-vintage-gold flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Stay Connected
            </h3>
            <p className="text-warm-gray text-sm leading-relaxed">
              Join our exclusive community for early access to new arrivals, expert jewelry insights, and special collector offers.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-warm-gray/10 border-warm-gray/30 text-cream-white placeholder:text-warm-gray focus:border-vintage-gold focus:ring-vintage-gold/20"
                required
              />
              <Button 
                type="submit"
                className="w-full btn-primary hover:bg-vintage-gold/90 transition-all duration-200 shadow-lg hover:shadow-vintage-gold/20"
                disabled={isSubscribed}
              >
                {isSubscribed ? '✓ Subscribed!' : 'Subscribe'}
              </Button>
            </form>
            
            <div className="space-y-3 pt-4 border-t border-warm-gray/20">
              <div className="flex items-center space-x-3 text-sm text-warm-gray hover:text-vintage-gold transition-colors duration-200 group">
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <a href="mailto:hello@vintagevault.com">hello@vintagevault.com</a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-warm-gray hover:text-vintage-gold transition-colors duration-200 group">
                <Phone className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <a href="tel:1-800-VINTAGE">1-800-VINTAGE (1-800-846-8243)</a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-warm-gray group">
                <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span>New York, NY • Los Angeles, CA</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-warm-gray group">
                <Globe className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Worldwide Shipping Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-vintage-gold/10 bg-black/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-warm-gray">
              <p>© 2024 VintageVault. All rights reserved.</p>
              <div className="flex items-center space-x-4">
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
            <div className="flex items-center space-x-4 text-xs text-warm-gray">
              <span className="flex items-center space-x-2">
                <Shield className="h-3 w-3" />
                <span>SSL Secured</span>
              </span>
              <span className="flex items-center space-x-2">
                <Award className="h-3 w-3" />
                <span>Authenticated Jewelry</span>
              </span>
              <span className="flex items-center space-x-2">
                <Truck className="h-3 w-3" />
                <span>Worldwide Shipping</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

