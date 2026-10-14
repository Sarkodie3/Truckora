import React from 'react';
import { Metadata } from 'next';
import { RotateCcw, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Returns & Reman Core Exchanges — TRUCKORA',
  description:
    'Commercial returns policy, workshop exchange procedures, and remanufactured core deposit return guidelines.',
};

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-brand-orange font-bold text-xs uppercase tracking-wider">
          Workshop Operations
        </span>
        <h1 className="text-3xl font-black text-brand-navy tracking-tight mt-1">
          Returns & Reman Core Exchanges
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Transparent guidelines for European workshops regarding parts returns, incorrect fitment claims, and surcharge deposit releases.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-truckora-border p-6 sm:p-8 shadow-xs space-y-4 text-xs text-slate-700 leading-relaxed">
        <h2 className="text-base font-bold text-brand-navy">1. Commercial 14-Day Return Right</h2>
        <p>
          B2B customers may return parts within 14 calendar days from receipt, provided the part has not been installed, operated, or dismantled, and remains in its original protective packaging. Return freight costs for standard customer cancellations are the responsibility of the purchasing party.
        </p>

        <h2 className="text-base font-bold text-brand-navy pt-4 border-t border-slate-100">
          2. Incorrect Part Delivery or Fitment Discrepancy
        </h2>
        <p>
          If a part was ordered following written VIN verification by TRUCKORA technical staff and fails to fit due to cataloguing error, TRUCKORA will arrange immediate prepaid collection and dispatch the correct replacement at zero additional freight charge.
        </p>

        <h2 className="text-base font-bold text-brand-navy pt-4 border-t border-slate-100">
          3. Remanufactured Core Surcharge Reimbursement
        </h2>
        <p>
          For components purchased under exchange terms (e.g. turbochargers, common rail pumps, steering boxes):
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>Old core units must be returned within 30 days of receiving the replacement part.</li>
          <li>Cores must be assembled, fully drained of lubricants/fluids, and free from external structural casing cracks or catastrophic fire damage.</li>
          <li>Upon technical intake inspection at our Rotterdam center, the core deposit is credited back to the original payment method within 5 business days.</li>
        </ul>
      </div>
    </div>
  );
}
