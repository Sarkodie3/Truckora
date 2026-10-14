import React from 'react';
import { ShieldCheck, Truck, Cpu, FileCheck2, Headphones, RotateCcw } from 'lucide-react';

export default function WhyChooseTruckora() {
  const pillars = [
    {
      icon: <FileCheck2 className="w-6 h-6 text-brand-orange" />,
      title: 'Verified OEM & Cross-Reference Data',
      description:
        'Every part in the TRUCKORA catalogue is indexed with official OEM part numbers and cross-referenced alternative manufacturer numbers to eliminate costly fitment errors.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-brand-orange" />,
      title: 'Chassis VIN Compatibility Support',
      description:
        'Our technical team uses commercial vehicle electronic parts catalogues (EPC) to verify exact build codes and specifications for your specific tractor chassis before dispatch.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-orange" />,
      title: 'Transparent Condition Classification',
      description:
        'Clear distinctions between brand-new components, dynamometer-tested used spares, and factory-refurbished parts with explicit warranty coverage terms.',
    },
    {
      icon: <Truck className="w-6 h-6 text-brand-orange" />,
      title: 'Dedicated Commercial Freight',
      description:
        'Specialized logistics network configured for heavy commercial transport: tail-lift pallet delivery for engines and gearboxes, and rapid express parcels for urgent sensors and calipers.',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-brand-orange" />,
      title: 'Core Exchange Management',
      description:
        'Streamlined return procedure for old exchange units (reman cores) on turbos, steering boxes, and injectors, with rapid deposit refunds.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-brand-orange" />,
      title: 'B2B Workshop & Fleet Helplines',
      description:
        'Direct phone and digital communication with commercial vehicle parts specialists who understand workshop schedules and transport deadlines.',
    },
  ];

  return (
    <section className="py-16 bg-truckora-bg border-b border-truckora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-brand-orange font-bold text-xs uppercase tracking-wider mb-1">
            Commercial Fleet Standards
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Why European Fleets Rely on TRUCKORA
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
            Reliable supply chain operations designed specifically around the uptime demands of commercial road transport.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-truckora-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <h3 className="font-bold text-sm text-brand-navy mb-2">{p.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
