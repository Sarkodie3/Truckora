'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, Phone, Mail, MapPin, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter a valid business email address.');
      return;
    }
    if (!newsletterConsent) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please consent to our privacy policy to subscribe.');
      return;
    }

    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterMessage('Thank you for subscribing to TRUCKORA fleet bulletins.');
      setNewsletterEmail('');
    }, 600);
  };

  return (
    <footer className="bg-brand-navy-dark text-slate-300 text-xs border-t border-slate-800">
      {/* Upper Newsletter & Value Prop Section */}
      <div className="bg-brand-navy border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-brand-orange font-bold text-xs uppercase tracking-wider mb-1">
              <Truck className="w-4 h-4" />
              <span>B2B Fleet Parts Dispatch</span>
            </div>
            <h3 className="text-white text-lg font-bold">
              Stay ahead on European commercial inventory & stock updates
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Receive weekly bulletins on newly dismantled tractors, OEM surplus lots, and freight promotions.
            </p>
          </div>

          <div>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your corporate email address..."
                  aria-label="Corporate email address"
                  className="bg-slate-900 border border-slate-700 text-white placeholder-slate-500 px-3.5 py-2.5 rounded-lg text-xs flex-1 focus:outline-none focus:border-brand-orange"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-colors shrink-0 disabled:opacity-50"
                >
                  {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>

              <label className="flex items-start gap-2 text-[11px] text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsletterConsent}
                  onChange={(e) => setNewsletterConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-brand-orange focus:ring-brand-orange bg-slate-900"
                />
                <span>
                  I agree to receive commercial updates in compliance with GDPR. You can unsubscribe at any time.
                </span>
              </label>

              {newsletterStatus === 'success' && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{newsletterMessage}</span>
                </div>
              )}
              {newsletterStatus === 'error' && (
                <div className="flex items-center gap-1.5 text-rose-400 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{newsletterMessage}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" inverted={true} />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              TRUCKORA is a dedicated European supplier of genuine, tested used, and factory reconditioned commercial truck spare parts. Serving transport fleets, repair workshops, and parts distributors across the European continent.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Port Logistics Zone 4, 3088 HD Rotterdam, Netherlands</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <span>+31 (0) 10 555 4900 (International B2B Dispatch)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <span>sales@truckora.eu / support@truckora.eu</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Top Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/engines" className="hover:text-white transition-colors">
                  Engines & Turbochargers
                </Link>
              </li>
              <li>
                <Link href="/categories/gearboxes-and-transmission" className="hover:text-white transition-colors">
                  Gearboxes & Retarders
                </Link>
              </li>
              <li>
                <Link href="/categories/brakes" className="hover:text-white transition-colors">
                  Brakes & Compressors
                </Link>
              </li>
              <li>
                <Link href="/categories/clutch" className="hover:text-white transition-colors">
                  Clutch Kits & Servos
                </Link>
              </li>
              <li>
                <Link href="/categories/cabin-and-body-parts" className="hover:text-white transition-colors">
                  Cabin & Body Panels
                </Link>
              </li>
              <li>
                <Link href="/categories/cooling-systems" className="hover:text-white transition-colors">
                  Radiators & Intercoolers
                </Link>
              </li>
              <li>
                <Link href="/categories/exhaust-and-aftertreatment" className="hover:text-white transition-colors">
                  AdBlue & SCR Denoxtronic
                </Link>
              </li>
            </ul>
          </div>

          {/* Truck Manufacturers */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Truck Makes
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/manufacturers/daf" className="hover:text-white transition-colors">
                  DAF Truck Parts
                </Link>
              </li>
              <li>
                <Link href="/manufacturers/volvo" className="hover:text-white transition-colors">
                  Volvo FH / FM Parts
                </Link>
              </li>
              <li>
                <Link href="/manufacturers/scania" className="hover:text-white transition-colors">
                  Scania R / S Series
                </Link>
              </li>
              <li>
                <Link href="/manufacturers/mercedes-benz" className="hover:text-white transition-colors">
                  Mercedes-Benz Actros
                </Link>
              </li>
              <li>
                <Link href="/manufacturers/man" className="hover:text-white transition-colors">
                  MAN TGX / TGS
                </Link>
              </li>
              <li>
                <Link href="/manufacturers/iveco" className="hover:text-white transition-colors">
                  IVECO Stralis / S-Way
                </Link>
              </li>
              <li>
                <Link href="/manufacturers/renault-trucks" className="hover:text-white transition-colors">
                  Renault Range T
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Legal */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              B2B & Legal Policies
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Freight & Shipping Rates
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns & Core Exchange
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-white transition-colors">
                  Warranty Coverage Terms
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  GDPR & Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookie Preferences
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  General Terms of Sale
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About TRUCKORA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Bottom Strip */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} TRUCKORA B.V. All rights reserved. Registered European Commercial Parts Vendor.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>EU Reverse-Charge B2B Invoicing</span>
            </span>
            <span>•</span>
            <span>EUR Pricing</span>
            <span>•</span>
            <Link href="/admin" className="hover:text-white font-mono text-[10px]">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
