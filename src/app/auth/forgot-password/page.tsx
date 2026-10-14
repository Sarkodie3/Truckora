'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/layout/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-truckora-border p-8 shadow-sm space-y-6">
        <div className="text-center">
          <Logo size="lg" className="justify-center" />
          <h2 className="mt-4 text-xl font-black text-brand-navy">
            Reset Password
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your business email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-900">Reset Email Dispatched</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              If an account matches <span className="font-semibold">{email}</span>, you will receive password reset instructions shortly.
            </p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="text-xs font-bold text-brand-navy hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="purchasing@company.eu"
                  className="w-full px-3 py-2 pl-9 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-brand-navy"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-navy hover:bg-brand-navy-light text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-colors"
            >
              Send Password Reset Link
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link
            href="/auth/login"
            className="text-xs font-semibold text-slate-500 hover:text-brand-navy transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
