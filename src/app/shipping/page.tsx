import React from 'react';
import { Metadata } from 'next';
import { Truck, Clock, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Freight Rates — TRUCKORA',
  description:
    'European commercial road freight rates, tail-lift pallet delivery timelines, and carrier tracking protocols.',
};

export default function ShippingPage() {
  const freightZones = [
    { zone: 'Zone 1 (Benelux)', countries: 'Netherlands, Belgium, Luxembourg', parcel: '€15.00', pallet: '€65.00', eta: '24 – 48 Hours' },
    { zone: 'Zone 2 (Central Europe)', countries: 'Germany, France, Austria, Denmark', parcel: '€19.50', pallet: '€85.00', eta: '48 – 72 Hours' },
    { zone: 'Zone 3 (Scandinavia & Southern EU)', countries: 'Sweden, Italy, Spain, Poland, Czechia', parcel: '€28.00', pallet: '€120.00', eta: '3 – 5 Days' },
    { zone: 'Zone 4 (Outer European Union)', countries: 'Finland, Ireland, Portugal, Romania, Greece', parcel: '€35.00', pallet: '€150.00', eta: '4 – 6 Days' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <span className="text-brand-orange font-bold text-xs uppercase tracking-wider">
          Logistics Protocols
        </span>
        <h1 className="text-3xl font-black text-brand-navy tracking-tight mt-1">
          European Freight & Delivery Information
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Standardized European road transport configured specifically for commercial truck mechanics, workshops, and transport depots.
        </p>
      </div>

      {/* Freight Rates Table */}
      <div className="bg-white rounded-xl border border-truckora-border overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-sm text-brand-navy">
            European Freight Schedule & Estimated In-Transit Timelines
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Freight Zone</th>
                <th className="py-3 px-4">Destinations</th>
                <th className="py-3 px-4">Express Parcel (&lt; 30kg)</th>
                <th className="py-3 px-4">Heavy Euro-Pallet</th>
                <th className="py-3 px-4">Estimated Transit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {freightZones.map((fz, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-brand-navy">{fz.zone}</td>
                  <td className="py-3 px-4">{fz.countries}</td>
                  <td className="py-3 px-4 font-semibold">{fz.parcel}</td>
                  <td className="py-3 px-4 font-bold text-brand-navy">{fz.pallet}</td>
                  <td className="py-3 px-4 font-medium text-emerald-700">{fz.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Freight Handling Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-brand-navy flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-orange" />
            <span>Heavy Unit & Pallet Freight Handling</span>
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Engines, manual & automated transmissions (TraXon, I-Shift), retarders, and differential units are secured on ISPM-15 heat-treated Euro-pallets using heavy-duty steel strapping and weather-resistant shrink wrapping. Carrier trucks are equipped with hydraulic tail-lifts for unloading at workshops without dedicated fork lift equipment.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-brand-navy flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-orange" />
            <span>Live Consignment Tracking & Notifications</span>
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Upon dispatch from the Rotterdam central hub, you will receive an automated waybill tracking code via email. Freight carriers contact the workshop contact provided during checkout prior to site arrival.
          </p>
        </div>
      </div>
    </div>
  );
}
