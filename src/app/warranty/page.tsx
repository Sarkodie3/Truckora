import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Warranty Information & Terms — TRUCKORA',
  description:
    'Warranty periods and terms for brand new, factory-reconditioned, and tested used truck spare parts.',
};

export default function WarrantyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-brand-orange font-bold text-xs uppercase tracking-wider">
          Quality Assurance Guarantee
        </span>
        <h1 className="text-3xl font-black text-brand-navy tracking-tight mt-1">
          Commercial Warranty Coverage
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          TRUCKORA stands firmly behind the mechanical reliability of all catalogued commercial vehicle components.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 uppercase">
            Brand New Parts
          </span>
          <div className="text-2xl font-black text-brand-navy">12 – 24 Months</div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Full manufacturer replacement warranty covering materials and manufacturing defects from date of delivery.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 uppercase">
            Factory Refurbished
          </span>
          <div className="text-2xl font-black text-brand-navy">12 – 24 Months</div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Rebuilt units (turbos, common rail pumps, gearboxes) tested to OEM tolerances on certified test benches.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 uppercase">
            Tested Used Spares
          </span>
          <div className="text-2xl font-black text-brand-navy">6 Months</div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Driveline and mechanical function warranty for salvaged parts verified in our dismantling center.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-truckora-border p-6 sm:p-8 shadow-xs space-y-4 text-xs text-slate-700 leading-relaxed">
        <h2 className="text-base font-bold text-brand-navy">Installation & Workshop Requirements</h2>
        <p>
          Warranty coverage is conditioned on professional installation performed by a certified commercial vehicle repair technician in accordance with manufacturer technical bulletins.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>Turbochargers: Oil feed pipes and oil filters must be renewed upon installation.</li>
          <li>Transmissions: Clean approved OEM fluid must be used and electronic clutch calibration executed.</li>
          <li>Common Rail Pumps & Injectors: Fuel lines and filters must be flushed and fuel rail pressure calibrated.</li>
        </ul>
      </div>
    </div>
  );
}
