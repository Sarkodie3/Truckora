'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { submitEnquiry } from '@/lib/services/enquiries';
import { Product } from '@/types';

interface CompatibilityEnquiryModalProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function CompatibilityEnquiryModal({
  product,
  isOpen,
  onClose,
}: CompatibilityEnquiryModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [truckMake, setTruckMake] = useState(
    product?.compatibility[0]?.manufacturerName || 'DAF'
  );
  const [truckModel, setTruckModel] = useState(
    product?.compatibility[0]?.modelName || ''
  );
  const [truckYear, setTruckYear] = useState('');
  const [vin, setVin] = useState('');
  const [message, setMessage] = useState(
    product ? `Please verify compatibility for part "${product.name}" (OEM: ${product.oemNumber}).` : ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (vin && vin.trim().length !== 17) {
      setErrorMsg('A standard European commercial truck VIN must be exactly 17 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitEnquiry({
        fullName,
        email,
        phone,
        enquiryType: 'part_compatibility',
        productId: product?.id,
        productName: product?.name,
        truckMake,
        truckModel,
        truckYear: truckYear ? parseInt(truckYear, 10) : undefined,
        vin,
        partNameOrOem: product?.oemNumber || undefined,
        message,
      });

      if (res.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(res.error || 'Failed to submit enquiry');
      }
    } catch {
      setStatus('error');
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-truckora-border max-w-lg w-full overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-orange" />
            <h3 className="text-base font-bold">Request Compatibility Verification</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close compatibility modal"
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {status === 'success' ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Enquiry Submitted</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Our commercial parts technical team will verify chassis fitment with the manufacturer parts catalog and email you back within 2 business hours.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="bg-brand-navy text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-brand-navy-light transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {product && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block">{product.name}</span>
                  <span className="text-slate-500 font-mono">OEM: {product.oemNumber} | SKU: {product.sku}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Klaus Schmidt"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="workshop@company.eu"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Truck Make
                  </label>
                  <select
                    value={truckMake}
                    onChange={(e) => setTruckMake(e.target.value)}
                    aria-label="Truck make selector"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:border-brand-navy focus:outline-none bg-white"
                  >
                    <option value="DAF">DAF</option>
                    <option value="Volvo Trucks">Volvo Trucks</option>
                    <option value="Scania">Scania</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="MAN">MAN</option>
                    <option value="IVECO">IVECO</option>
                    <option value="Renault Trucks">Renault Trucks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Model / Series
                  </label>
                  <input
                    type="text"
                    value={truckModel}
                    onChange={(e) => setTruckModel(e.target.value)}
                    placeholder="e.g. XF 106 480"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Build Year
                  </label>
                  <input
                    type="number"
                    value={truckYear}
                    onChange={(e) => setTruckYear(e.target.value)}
                    placeholder="e.g. 2018"
                    min="1995"
                    max="2026"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                  />
                </div>
              </div>

              {/* Vehicle VIN input with sensitive disclaimer */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Chassis VIN (Optional but recommended)</span>
                  <span className="text-[10px] text-slate-400 font-mono font-normal">17 characters</span>
                </label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  maxLength={17}
                  placeholder="e.g. XLRTE47MS0G123456"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono uppercase focus:border-brand-navy focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Note: A Vehicle Identification Number (VIN) is used exclusively for electronic EPC chassis parts lookup and is not stored or shared publicly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Requirements / Questions *
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us any details (e.g. connector pin count, engine code, manual vs automated transmission)..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-1.5 text-rose-600 text-xs bg-rose-50 p-2.5 rounded border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Verify Fitment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
