'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { CATEGORIES, TRUCK_MANUFACTURERS } from '@/lib/data/mock-data';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandsDropdownOpen, setBrandsDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  return (
    <nav className="bg-brand-navy text-white text-xs font-semibold relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          {/* Desktop Categories & Brands Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* All Categories Dropdown Button */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                type="button"
                className="bg-brand-orange hover:bg-brand-orange-hover text-white px-3.5 py-2 rounded-t flex items-center gap-1.5 transition-colors font-bold uppercase tracking-wider text-[11px]"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>All Categories</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {/* Categories Dropdown Panel */}
              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white text-slate-800 shadow-xl border border-truckora-border rounded-b-lg py-2 z-50 animate-fadeIn">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 hover:bg-slate-100 hover:text-brand-navy text-xs transition-colors"
                    >
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-normal">
                        {cat.productCount}
                      </span>
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 mt-2 pt-2 px-4">
                    <Link
                      href="/categories"
                      className="text-brand-orange hover:underline text-xs font-bold block"
                    >
                      View All 13 Categories →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Truck Brands Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setBrandsDropdownOpen(true)}
              onMouseLeave={() => setBrandsDropdownOpen(false)}
            >
              <button
                type="button"
                className="hover:bg-brand-navy-light px-3 py-2 rounded flex items-center gap-1 transition-colors"
              >
                <span>Truck Makes</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {brandsDropdownOpen && (
                <div className="absolute top-full left-0 w-56 bg-white text-slate-800 shadow-xl border border-truckora-border rounded-lg py-2 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    European Truck Makes
                  </div>
                  {TRUCK_MANUFACTURERS.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/manufacturers/${brand.slug}`}
                      onClick={() => setBrandsDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 hover:bg-slate-100 hover:text-brand-navy text-xs font-semibold"
                    >
                      <span>{brand.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{brand.country}</span>
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1.5 px-4">
                    <Link
                      href="/manufacturers"
                      className="text-brand-orange hover:underline text-xs font-bold block"
                    >
                      Browse All Brands →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Top Direct Category Links */}
            <Link
              href="/categories/engines"
              className="hover:bg-brand-navy-light px-2.5 py-2 rounded transition-colors"
            >
              Engines
            </Link>
            <Link
              href="/categories/gearboxes-and-transmission"
              className="hover:bg-brand-navy-light px-2.5 py-2 rounded transition-colors"
            >
              Gearboxes
            </Link>
            <Link
              href="/categories/brakes"
              className="hover:bg-brand-navy-light px-2.5 py-2 rounded transition-colors"
            >
              Brakes
            </Link>
            <Link
              href="/categories/clutch"
              className="hover:bg-brand-navy-light px-2.5 py-2 rounded transition-colors"
            >
              Clutch
            </Link>
            <Link
              href="/categories/cabin-and-body-parts"
              className="hover:bg-brand-navy-light px-2.5 py-2 rounded transition-colors"
            >
              Cabin & Body
            </Link>
            <Link
              href="/categories/electrical-and-electronics"
              className="hover:bg-brand-navy-light px-2.5 py-2 rounded transition-colors"
            >
              Electrical
            </Link>
            <Link
              href="/categories/cooling-systems"
              className="hover:bg-brand-navy-light px-2.5 py-2 rounded transition-colors"
            >
              Cooling
            </Link>
            <Link
              href="/categories/exhaust-and-aftertreatment"
              className="hover:bg-brand-navy-light px-2.5 py-2 rounded transition-colors"
            >
              Exhaust / AdBlue
            </Link>
          </div>

          {/* New / Used direct condition badges & Admin link */}
          <div className="hidden md:flex items-center space-x-3 text-xs">
            <Link
              href="/condition/new"
              className="flex items-center gap-1 text-emerald-300 hover:text-white transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Brand New Parts</span>
            </Link>
            <span className="text-slate-500">|</span>
            <Link
              href="/condition/used"
              className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tested Used Parts</span>
            </Link>
            <span className="text-slate-500">|</span>
            <Link
              href="/admin"
              className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[11px] font-mono border border-slate-700"
            >
              Admin Portal
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center justify-between w-full py-2">
            <span className="text-slate-300 text-xs font-semibold">TRUCKORA Navigation</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded bg-brand-navy-light text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-navy-dark border-t border-slate-700 py-4 px-2 space-y-3">
            <div className="space-y-1">
              <div className="px-3 text-[11px] font-bold text-brand-orange uppercase">
                Truck Manufacturers
              </div>
              <div className="grid grid-cols-2 gap-1 px-2 pt-1">
                {TRUCK_MANUFACTURERS.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/manufacturers/${brand.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2 py-1.5 text-xs text-slate-200 hover:text-brand-orange"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-1 border-t border-slate-800 pt-3">
              <div className="px-3 text-[11px] font-bold text-brand-orange uppercase">
                Major Categories
              </div>
              <div className="grid grid-cols-2 gap-1 px-2 pt-1">
                {CATEGORIES.slice(0, 8).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2 py-1.5 text-xs text-slate-200 hover:text-brand-orange truncate"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-xs text-brand-orange font-bold"
              >
                View All Categories →
              </Link>
            </div>

            <div className="border-t border-slate-800 pt-3 flex flex-col gap-2 px-3">
              <Link
                href="/condition/new"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-emerald-400 font-semibold"
              >
                ✓ Brand New Truck Parts
              </Link>
              <Link
                href="/condition/used"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-amber-400 font-semibold"
              >
                ✓ Tested Used & Refurbished Spares
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-300 font-mono"
              >
                ⚙ Admin Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
