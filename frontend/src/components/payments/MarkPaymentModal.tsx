import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { recordPayment } from '../../services/api';
import { Document } from '../../types';
import { CreditCard, AlertCircle, Calendar, Hash, Tag } from 'lucide-react';

interface MarkPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onSuccess: (updatedDoc: Document) => void;
}

export const MarkPaymentModal: React.FC<MarkPaymentModalProps> = ({
  isOpen,
  onClose,
  document,
  onSuccess,
}) => {
  if (!document) return null;

  const balanceLeft = document.balance;
  const [paidAmount, setPaidAmount] = useState<number>(balanceLeft);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<string>('Cash');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (document) {
      setPaidAmount(document.balance);
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setMethod('Cash');
      setPaymentReference('');
      setError('');
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paidAmount <= 0 || paidAmount > balanceLeft) {
      setError(`Amount must be greater than 0 and cannot exceed remaining balance of TSH ${balanceLeft.toLocaleString()}`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const updated = await recordPayment({
        documentId: document.id,
        paidAmount,
        paymentDate,
        method,
        paymentReference,
      });
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to submit payment.');
    } finally {
      setLoading(false);
    }
  };

  const isInvoice = document.documentType.toLowerCase().includes('invoice');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment Transaction" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Document Context Card */}
        <div className="p-4 glass-panel p-4 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Document Number:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              {document.documentNumber} ({isInvoice ? 'Invoice' : 'Debit Note'})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">File ID:</span>
            <span className="font-mono font-bold text-brand-600 dark:text-brand-400">#{document.fileCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Client:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{document.clientName}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 font-semibold">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Total Document Bill</span>
              <span className="text-slate-900 dark:text-white font-mono">TSH {document.total.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-rose-500 uppercase block">Remaining Balance</span>
              <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">
                TSH {balanceLeft.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Amount Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Payment Amount to Record (TSH) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            max={balanceLeft}
            min={0.01}
            required
            value={paidAmount}
            onChange={(e) => setPaidAmount(Number(e.target.value))}
            className="w-full px-3.5 py-2 text-base font-bold glass-input rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white font-mono text-emerald-600 dark:text-emerald-400"
          />
        </div>

        {/* Date & Method Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-3 py-2 text-xs glass-input rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 text-xs glass-input rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white font-semibold"
            >
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="TT">Bank TT Transfer</option>
            </select>
          </div>
        </div>

        {/* Reference / Cheque No */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Reference / Cheque No. (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. CHQ-998812 or TT Ref 4410"
            value={paymentReference}
            onChange={(e) => setPaymentReference(e.target.value)}
            className="w-full px-3 py-2 text-xs glass-input rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-900/10 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 rounded-xl transition-all border border-slate-900/10 dark:border-white/10 backdrop-blur-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 disabled:opacity-50 border border-white/20"
          >
            <CreditCard className="w-4 h-4" />
            <span>{loading ? 'Recording Payment...' : 'Record Payment'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

