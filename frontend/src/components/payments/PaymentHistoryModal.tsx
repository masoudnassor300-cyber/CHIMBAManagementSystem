import React from 'react';
import { Document } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Calendar, CreditCard, DollarSign, CheckCircle2, History, Hash, FileText } from 'lucide-react';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  isOpen,
  onClose,
  document: doc,
}) => {
  if (!doc) return null;

  const isInvoice = doc.documentType.toLowerCase().includes('invoice');
  const isFullyPaid = doc.status === 'PAID' || doc.balance <= 0;
  const isUnpaid = doc.status === 'UNPAID' || (doc.paidAmount || 0) <= 0;
  const history = doc.paymentHistory || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Document Payment History" maxWidth="2xl">
      <div className="space-y-6">
        {/* Document Header Summary Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-lg text-slate-900 dark:text-white">
                  {doc.documentNumber}
                </span>
                <Badge variant={isInvoice ? 'blue' : 'rose'}>
                  {isInvoice ? 'TAX INVOICE' : 'DEBIT NOTE'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                File ID: <strong className="text-brand-600 dark:text-brand-400">#{doc.fileCode}</strong> • Client: <strong className="text-slate-700 dark:text-slate-200">{doc.clientName}</strong>
              </p>
            </div>

            <div className="text-right">
              {isFullyPaid ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold text-xs border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Fully Paid
                </span>
              ) : isUnpaid ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full font-bold text-xs border border-rose-500/20">
                  <DollarSign className="w-3.5 h-3.5" /> Unpaid
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full font-bold text-xs border border-amber-500/20">
                  <History className="w-3.5 h-3.5" /> Partially Paid
                </span>
              )}
            </div>
          </div>

          {/* Financial Breakdown Grid */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="bg-slate-900/[0.04] dark:bg-white/[0.04] p-3 rounded-xl border border-slate-900/10 dark:border-white/10 backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Billed</span>
              <span className="font-mono font-bold text-sm text-slate-900 dark:text-white mt-0.5 block">
                TSH {doc.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-slate-900/[0.04] dark:bg-white/[0.04] p-3 rounded-xl border border-slate-900/10 dark:border-white/10 backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold text-emerald-500 block">Total Paid</span>
              <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                TSH {(doc.paidAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-slate-900/[0.04] dark:bg-white/[0.04] p-3 rounded-xl border border-slate-900/10 dark:border-white/10 backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold text-rose-500 block">Remaining Due</span>
              <span className="font-mono font-bold text-sm text-rose-600 dark:text-rose-400 mt-0.5 block">
                TSH {doc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Records Audit List */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-brand-500" /> Recorded Payment Audit Log ({history.length})
          </h4>

          {history.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/[0.02] dark:bg-white/[0.02] rounded-2xl border border-dashed border-slate-900/10 dark:border-white/10 backdrop-blur-sm">
              <CreditCard className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">No Payments Recorded Yet</p>
              <p className="text-[11px] text-slate-400 mt-1">This document has not received any payment transactions.</p>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-extrabold uppercase border-b border-slate-900/10 dark:border-white/10 backdrop-blur-sm">
                  <tr>
                    <th className="p-3">Payment Date</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Reference / Cheque</th>
                    <th className="p-3 text-right">Amount (TSH)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/5 dark:divide-white/5 font-medium">
                  {history.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-900/5 dark:hover:bg-white/5 transition-all">
                      <td className="p-3 text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-brand-500" />
                          <span>{item.paymentDate}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-900/5 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-[11px] border border-slate-900/10 dark:border-white/10 backdrop-blur-sm">
                          {item.method || 'Cash'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-300">
                        {item.paymentReference || '-'}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        + TSH {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="pt-2 border-t border-slate-900/10 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-900/10 dark:border-white/10 backdrop-blur-sm"
          >
            Close Window
          </button>
        </div>
      </div>
    </Modal>
  );
};

