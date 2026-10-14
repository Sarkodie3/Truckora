'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileQuestion,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';
import { getEnquiries, updateEnquiryStatus } from '@/lib/services/enquiries';
import { CustomerEnquiry } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const loadEnquiries = async () => {
    const list = await getEnquiries();
    setEnquiries(list);
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) return;
    await updateEnquiryStatus(id, 'resolved', replyText.trim());
    setActiveReplyId(null);
    setReplyText('');
    loadEnquiries();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 mb-8 border-b border-truckora-border">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
          <Link href="/admin" className="hover:text-brand-orange flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin Operations</span>
          </Link>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
          Customer Technical Enquiries & VIN Fitment Requests
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Answer workshop fitment tickets with manufacturer EPC part numbers.
        </p>
      </div>

      <div className="space-y-4">
        {enquiries.map((enq) => (
          <div
            key={enq.id}
            className="bg-white rounded-xl border border-truckora-border p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="font-bold text-sm text-brand-navy">
                  {enq.fullName} • {enq.email} {enq.phone ? `(${enq.phone})` : ''}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Truck: <span className="font-semibold text-slate-800">{enq.truckMake} {enq.truckModel}</span>
                  {enq.truckYear ? ` • Year: ${enq.truckYear}` : ''}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">
                  {formatDate(enq.createdAt)}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    enq.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {enq.status}
                </span>
              </div>
            </div>

            {enq.vin && (
              <div className="bg-slate-100 p-2.5 rounded text-xs font-mono text-slate-800 flex items-center justify-between">
                <span>Chassis VIN: <strong>{enq.vin}</strong></span>
                <span className="text-[10px] text-slate-500 font-sans">
                  Standard European 17-digit Chassis Code
                </span>
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700">
              <span className="font-bold text-slate-500 block text-[10px] uppercase mb-1">
                Customer Message:
              </span>
              {enq.message}
            </div>

            {enq.adminResponse ? (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-900">
                <span className="font-bold block text-emerald-800 mb-0.5">
                  Dispatched Technical Reply:
                </span>
                {enq.adminResponse}
              </div>
            ) : activeReplyId === enq.id ? (
              <div className="space-y-3 pt-2">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official EPC recommendation or confirm fitment..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded focus:border-brand-navy focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveReplyId(null)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendReply(enq.id)}
                    className="bg-brand-navy hover:bg-brand-navy-light text-white px-4 py-1.5 text-xs font-bold rounded flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply to Customer</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setActiveReplyId(enq.id);
                    setReplyText(
                      `Part compatibility verified against chassis ${enq.vin || 'specifications'}. Direct fitment confirmed.`
                    );
                  }}
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white px-4 py-1.5 rounded text-xs font-bold transition-colors"
                >
                  Compose Technical Response
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
