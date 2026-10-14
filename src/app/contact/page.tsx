'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { submitEnquiry } from '@/lib/services/enquiries';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await submitEnquiry({
      fullName,
      email,
      phone,
      enquiryType: 'general',
      message: `${companyName ? `[Company: ${companyName}] ` : ''}${message}`,
    });

    setSubmitting(false);
    setSuccess(true);
    setFullName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mb-10">
        <span className="text-brand-orange font-bold text-xs uppercase tracking-wider">
          Direct Commercial Communication
        </span>
        <h1 className="text-3xl font-black text-brand-navy tracking-tight mt-1">
          Contact TRUCKORA Commercial Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Our parts engineers and logistics dispatchers are on duty to handle fleet quotations, chassis compatibility verification, and carrier dispatch inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-navy text-brand-orange flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-brand-navy">International Phone Support</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct line for workshop urgency, pallet bookings, and expedited dispatches.
            </p>
            <a
              href="tel:+31105554900"
              className="text-sm font-black text-brand-orange hover:underline block pt-1"
            >
              +31 (0) 10 555 4900
            </a>
          </div>

          <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-navy text-brand-orange flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-brand-navy">Commercial Email Inquiries</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Send purchase orders, VIES VAT queries, or technical EPC parts lists.
            </p>
            <div className="text-xs font-semibold text-slate-700 space-y-1 pt-1">
              <div>Sales: <span className="font-mono text-brand-navy">sales@truckora.eu</span></div>
              <div>Technical: <span className="font-mono text-brand-navy">support@truckora.eu</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-navy text-brand-orange flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-brand-navy">Warehouse Hours (CET)</h3>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Monday – Friday:</span>
                <span className="font-semibold text-slate-900">08:00 – 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday Pallet Collections:</span>
                <span className="font-semibold text-slate-900">09:00 – 13:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-slate-400">Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-truckora-border p-8 shadow-xs">
            <h2 className="text-lg font-bold text-brand-navy mb-1">
              Submit a Commercial Parts Inquiry
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Our technicians will respond with pricing, delivery timeline, and OEM verification within 2 hours.
            </p>

            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-base text-emerald-900">Inquiry Dispatched</h3>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                  Your message has been submitted to our technical logistics desk. A commercial representative will follow up via email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="bg-brand-navy text-white px-5 py-2 rounded-lg text-xs font-bold"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Hans Becker"
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="purchasing@company.eu"
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Rhine Logistics GmbH"
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+49 221 9898 120"
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Inquiry Details / OEM Part Numbers / Chassis VIN *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specify truck make, model, year, part numbers, quantity, or delivery city..."
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-brand-navy hover:bg-brand-orange text-white font-bold py-2.5 px-6 rounded-lg text-xs flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Sending...' : 'Transmit Inquiry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
