'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { signIn, signUp, resetPassword } from '@/lib/auth';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSeller, setIsSeller] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
        onClose();
      } else if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
        await signUp(formData.email, formData.password, formData.fullName);
        setSuccess('Please check your email to confirm your account');
      } else if (mode === 'forgot') {
        await resetPassword(formData.email);
        setSuccess('Password reset email sent');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: '',
    });
    setError('');
    setSuccess('');
    setIsSeller(false);
  };

  const switchMode = (newMode: 'login' | 'register' | 'forgot') => {
    setMode(newMode);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-serif text-2xl text-deep-charcoal">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Join VintageVault'}
            {mode === 'forgot' && 'Reset Password'}
          </DialogTitle>
          <DialogDescription className="text-center text-warm-gray">
            {mode === 'login' && 'Sign in to your account to continue shopping'}
            {mode === 'register' && 'Create an account to start buying and selling jewelry'}
            {mode === 'forgot' && 'Enter your email to receive a password reset link'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name - Register only */}
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-warm-gray" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="pl-10 input-elegant"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-warm-gray" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 input-elegant"
                required
              />
            </div>
          </div>

          {/* Password - Not for forgot mode */}
          {mode !== 'forgot' && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-warm-gray" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 input-elegant"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-warm-gray hover:text-vintage-gold"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password - Register only */}
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-warm-gray" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 input-elegant"
                  required
                />
              </div>
            </div>
          )}

          {/* Seller Checkbox - Register only */}
          {mode === 'register' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isSeller"
                checked={isSeller}
                onCheckedChange={(checked) => setIsSeller(checked as boolean)}
              />
              <Label htmlFor="isSeller" className="text-sm text-warm-gray">
                I want to sell jewelry on VintageVault
              </Label>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (
              <>
                {mode === 'login' && 'Sign In'}
                {mode === 'register' && 'Create Account'}
                {mode === 'forgot' && 'Send Reset Link'}
              </>
            )}
          </Button>

          {/* Mode Switching */}
          <div className="text-center space-y-2">
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-vintage-gold hover:underline"
                >
                  Forgot your password?
                </button>
                <div className="text-sm text-warm-gray">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="text-vintage-gold hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === 'register' && (
              <div className="text-sm text-warm-gray">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-vintage-gold hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === 'forgot' && (
              <div className="text-sm text-warm-gray">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-vintage-gold hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

