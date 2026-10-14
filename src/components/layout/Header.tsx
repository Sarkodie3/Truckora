'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, HelpCircle, Shield, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { useCart } from '@/context/CartContext';
import { formatCentsToEur } from '@/lib/utils';

export default function Header() {
  const router = useRouter();
  const { itemCount, subtotalCents } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'all' | 'oem'>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchMode === 'oem') {
      router.push(`/search?oem=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-truckora-border sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Unified High-Performance OEM & Keyword Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="flex items-center w-full border-2 border-brand-navy rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-orange transition-all">
                {/* Search Type Selector */}
                <select
                  value={searchMode}
                  onChange={(e) => setSearchMode(e.target.value as 'all' | 'oem')}
                  aria-label="Search filter mode"
                  className="bg-slate-100 text-xs font-semibold text-slate-700 px-3 py-2.5 border-r border-slate-300 focus:outline-none cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <option value="all">All Parts</option>
                  <option value="oem">OEM / Part #</option>
                </select>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    searchMode === 'oem'
                      ? 'Enter OEM number (e.g. 1853604, 21543897, A0004204500)...'
                      : 'Search by part name, SKU, OEM or truck model (e.g. DAF XF Turbo)...'
                  }
                  className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />

                <button
                  type="submit"
                  aria-label="Submit search query"
                  className="bg-brand-navy hover:bg-brand-navy-light text-white px-5 py-2.5 flex items-center justify-center transition-colors"
                >
                  <Search className="w-4 h-4 text-brand-orange" />
                </button>
              </div>
            </form>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Popular OEM Lookups:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('1853604');
                  setSearchMode('oem');
                  router.push('/search?oem=1853604');
                }}
                className="hover:text-brand-orange transition-colors underline decoration-slate-300"
              >
                DAF 1853604
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('21543897');
                  setSearchMode('oem');
                  router.push('/search?oem=21543897');
                }}
                className="hover:text-brand-orange transition-colors underline decoration-slate-300"
              >
                Volvo 21543897
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('1934322');
                  setSearchMode('oem');
                  router.push('/search?oem=1934322');
                }}
                className="hover:text-brand-orange transition-colors underline decoration-slate-300"
              >
                Scania 1934322
              </button>
            </div>
          </div>

          {/* User Quick Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Contact / Help */}
            <Link
              href="/contact"
              className="hidden lg:flex items-center gap-2 text-slate-700 hover:text-brand-navy transition-colors text-xs font-medium"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 uppercase">Need Help?</span>
                <span className="font-semibold">Parts Support</span>
              </div>
            </Link>

            {/* Customer Account */}
            <Link
              href="/account"
              className="flex items-center gap-2 text-slate-700 hover:text-brand-navy transition-colors text-xs font-medium"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-slate-400 uppercase">B2B Portal</span>
                <span className="font-semibold">My Account</span>
              </div>
            </Link>

            {/* Shopping Cart Pill */}
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-brand-navy text-white px-3.5 py-2 rounded-lg hover:bg-brand-navy-light transition-all shadow-sm group"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-brand-orange group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-300 uppercase leading-none">Cart</span>
                <span className="text-xs font-bold leading-tight">
                  {formatCentsToEur(subtotalCents)}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className="flex items-center w-full border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-orange bg-slate-50">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search OEM, SKU, or part name..."
                className="w-full px-3 py-2 text-xs bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Submit mobile search"
                className="bg-brand-navy text-white px-3 py-2"
              >
                <Search className="w-3.5 h-3.5 text-brand-orange" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
