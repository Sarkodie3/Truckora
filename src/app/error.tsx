'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('TRUCKORA Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-rose-200 p-8 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h1 className="text-xl font-bold text-brand-navy">
          Catalogue Processing Interrupted
        </h1>

        <p className="text-xs text-slate-500 leading-relaxed">
          An unexpected error occurred while communicating with the inventory data service. Please retry or contact technical dispatch.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-brand-navy hover:bg-brand-navy-light text-white font-bold px-5 py-2 rounded-lg text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Request</span>
          </button>
        </div>
      </div>
    </div>
  );
}
