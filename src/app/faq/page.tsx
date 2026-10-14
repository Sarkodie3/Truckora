import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, ChevronRight, FileQuestion } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) — TRUCKORA',
  description:
    'Answers to commercial questions regarding European truck parts, OEM number matching, reverse charge VAT, and heavy pallet freight.',
};

export default function FaqPage() {
  const faqs = [
    {
      q: 'How does TRUCKORA ensure correct part fitment for my specific truck?',
      a: 'We index all parts against official manufacturer OEM references and alternative super-session numbers. When you provide your 17-digit chassis VIN, our technical team checks the electronic parts catalog (EPC) for your exact build sheet before shipping.',
    },
    {
      q: 'How does EU intra-community reverse charge VAT work at checkout?',
      a: 'Under European Union VAT regulations, registered B2B entities located in EU Member States outside the Netherlands (our distribution base) are eligible for zero-rated intra-community supplies (0% VAT). Enter your company VAT ID during checkout; upon VIES validation, VAT is automatically removed from the total.',
    },
    {
      q: 'What is the difference between New, Used, and Refurbished parts?',
      a: 'Brand New parts are unused factory-fresh units in original packaging with 12-24m warranty. Tested Used parts are low-mileage components reclaimed from dismantled European fleet tractors, load-tested on rigs with 6m warranty. Refurbished parts have undergone complete mechanical overhaul, replacement of high-wear internals, dynamic balancing, and re-calibration.',
    },
    {
      q: 'How are heavy engines, gearboxes, and axle assemblies delivered?',
      a: 'Large and heavy components (> 40 kg) are strapped and secured on heat-treated Euro-pallets and transported via specialized road freight carriers (DHL Freight, Kuehne+Nagel) equipped with hydraulic tail-lifts for workshop unloading.',
    },
    {
      q: 'How does the Core Exchange / Surcharge deposit program operate?',
      a: 'Certain remanufactured parts (turbos, common rail pumps, steering gearboxes) require the return of your old exchange core. You have 30 days following delivery to return the core in our prepaid packaging to receive an immediate refund of the core deposit.',
    },
    {
      q: 'Can I collect parts directly from your Rotterdam distribution facility?',
      a: 'Yes. Commercial workshops and fleet operators can arrange direct collection during operational hours (Monday to Friday 08:00 – 18:00 CET, Saturday 09:00 – 13:00 CET). Please confirm order clearance prior to vehicle arrival.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mb-10">
        <span className="text-brand-orange font-bold text-xs uppercase tracking-wider">
          Commercial Operations Knowledgebase
        </span>
        <h1 className="text-3xl font-black text-brand-navy tracking-tight mt-1">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Common technical and billing inquiries from fleet operators, repair workshops, and parts dealers.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-2"
          >
            <h2 className="font-bold text-sm sm:text-base text-brand-navy flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-brand-orange/10 text-brand-orange text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                Q
              </span>
              <span>{faq.q}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-slate-50 rounded-xl border border-slate-200 p-6 text-center space-y-3">
        <h3 className="font-bold text-sm text-brand-navy">Have a specific technical question?</h3>
        <p className="text-xs text-slate-500">
          Our commercial vehicle parts engineers are available on our direct support line.
        </p>
        <div className="pt-1">
          <Link
            href="/contact"
            className="bg-brand-navy hover:bg-brand-orange text-white font-bold px-5 py-2 rounded-lg text-xs transition-colors inline-block"
          >
            Contact Technical Team
          </Link>
        </div>
      </div>
    </div>
  );
}
