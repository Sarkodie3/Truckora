import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & GDPR Compliance — TRUCKORA',
  description:
    'Information on how TRUCKORA collects, processes, and protects corporate and personal data in accordance with the EU General Data Protection Regulation (GDPR).',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-brand-orange font-bold text-xs uppercase tracking-wider">
          European Compliance
        </span>
        <h1 className="text-3xl font-black text-brand-navy tracking-tight mt-1">
          Privacy Policy & GDPR Statement
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Effective Date: 1 January 2026 • Compliant with EU Regulation 2016/679 (GDPR).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-truckora-border p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-navy">1. Data Controller Identification</h2>
          <p>
            The data controller responsible for the processing of your personal and commercial data on this website is TRUCKORA B.V., registered in Rotterdam, Netherlands (Contact: privacy@truckora.eu).
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-brand-navy">2. Categories of Data Processed</h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Customer Contact & Corporate Information:</strong> Name, company name, delivery address, phone number, and corporate billing details.</li>
            <li><strong>Tax & Business Identifiers:</strong> European VAT Identification numbers verified via the European Commission VIES system.</li>
            <li><strong>Vehicle Identification Data (VIN):</strong> 17-digit chassis numbers provided voluntarily for electronic EPC compatibility verification.</li>
            <li><strong>Transactional Records:</strong> Order items, payment confirmation timestamps, and delivery waybill references.</li>
          </ul>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-brand-navy">3. Purpose and Legal Basis for Processing</h2>
          <p>
            Data is processed on the legal basis of Article 6(1)(b) GDPR (performance of commercial contract), Article 6(1)(c) GDPR (compliance with fiscal, customs, and VAT recording obligations), and Article 6(1)(f) GDPR (legitimate commercial interest in preventing fraud and verifying parts fitment).
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-brand-navy">4. Protection of Vehicle Chassis Numbers (VIN)</h2>
          <p>
            A Vehicle Identification Number (VIN) constitutes vehicle-specific metadata. TRUCKORA restricts access to submitted VINs exclusively to qualified technical personnel for parts lookup. VINs are never published, shared with marketing networks, or indexed publicly.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-brand-navy">5. Your Rights as a Data Subject</h2>
          <p>
            Under European data protection law, you hold the right to access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), and data portability (Art. 20). Requests may be lodged directly via email at privacy@truckora.eu.
          </p>
        </section>
      </div>
    </div>
  );
}
