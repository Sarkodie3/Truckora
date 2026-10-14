'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-brand-orange font-bold text-xs uppercase tracking-wider">
          Privacy Settings
        </span>
        <h1 className="text-3xl font-black text-brand-navy tracking-tight mt-1">
          Cookie Policy & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Manage how cookies and local storage tokens are utilized on TRUCKORA.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-truckora-border p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-700">
        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-sm text-brand-navy block">
                Strictly Necessary Cookies & Storage (Mandatory)
              </span>
              <p className="text-slate-500 mt-1">
                Required for core website operations: shopping cart preservation, authentication session tokens, and secure checkout processing.
              </p>
            </div>
            <input type="checkbox" checked={true} disabled className="mt-1 rounded text-brand-navy cursor-not-allowed" />
          </div>

          <div className="flex items-start justify-between p-4 rounded-lg border border-slate-200">
            <div>
              <span className="font-bold text-sm text-brand-navy block">
                Functional & Preference Cookies
              </span>
              <p className="text-slate-500 mt-1">
                Remembers selected destination currency (EUR), recently viewed truck models, and active catalogue filters.
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.functional}
              onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
              className="mt-1 rounded text-brand-orange focus:ring-brand-orange"
            />
          </div>

          <div className="flex items-start justify-between p-4 rounded-lg border border-slate-200">
            <div>
              <span className="font-bold text-sm text-brand-navy block">
                Performance & Diagnostics
              </span>
              <p className="text-slate-500 mt-1">
                Helps us monitor server latency and catalogue search performance without tracking individual personal identities.
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
              className="mt-1 rounded text-brand-orange focus:ring-brand-orange"
            />
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cookie preferences updated successfully.</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="bg-brand-navy hover:bg-brand-navy-light text-white font-bold py-2 px-5 rounded-lg text-xs transition-colors"
          >
            Save Cookie Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
