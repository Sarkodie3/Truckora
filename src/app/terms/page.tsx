import React from 'react';
import { Metadata } from 'next';
import { FileText, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'General Terms & Conditions of Sale — TRUCKORA',
  description:
    'General B2B conditions of sale governing commercial truck spare parts transactions, payment, freight dispatch, and retention of title.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-brand-orange font-bold text-xs uppercase tracking-wider">
          Legal Framework
        </span>
        <h1 className="text-3xl font-black text-brand-navy tracking-tight mt-1">
          General Terms & Conditions of Sale
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Standard terms applicable to commercial contracts and sales fulfilled by TRUCKORA B.V.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-truckora-border p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-brand-navy">1. Scope of Application</h2>
          <p>
            These General Terms and Conditions govern all commercial sales, supply agreements, and parts deliveries executed between TRUCKORA B.V. and business entities (fleets, workshops, transport operators, and distributors).
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-brand-navy">2. Pricing, Invoicing, and European VAT</h2>
          <p>
            Unless explicitly noted otherwise, all catalogue prices are denominated in EUR (€) and stated exclusive of Value Added Tax (VAT) and freight shipping. For intra-community B2B acquisitions outside the Netherlands, the purchasing entity warrants that its provided VAT identification number is valid under VIES. In the event of VAT exemption rejection, the customer remains strictly liable for full VAT assessment.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-brand-navy">3. Retention of Title (Eigentumsvorbehalt)</h2>
          <p>
            TRUCKORA retains full legal title and ownership of all supplied commercial truck parts, engines, and transmissions until all invoice amounts relating to the respective transaction have been paid in full.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-brand-navy">4. Inspection & Notification of Transport Damage</h2>
          <p>
            The receiving party must visually inspect goods and pallet strapping upon delivery. Any visible carrier damage must be recorded directly on the carrier consignment note (CMR) upon handover. Latent technical defects must be reported within 7 business days of delivery.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-brand-navy">5. Governing Law and Jurisdiction</h2>
          <p>
            All legal relations between TRUCKORA B.V. and the customer shall be governed exclusively by the laws of the Netherlands, excluding the United Nations Convention on Contracts for the International Sale of Goods (CISG). Any disputes shall be submitted exclusively to the competent court in Rotterdam.
          </p>
        </section>
      </div>
    </div>
  );
}
