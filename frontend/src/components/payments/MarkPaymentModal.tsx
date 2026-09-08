import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { markPayment } from '../../services/api';
import { Document } from '../../types';
import { CreditCard, AlertCircle } from 'lucide-react';

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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paidAmount <= 0 || paidAmount > balanceLeft) {
      setError(`Amount must be greater than 0 and cannot exceed balance of TSH ${balanceLeft.toLocaleString()}`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const updated = await markPayment(document.id, paidAmount);
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to submit payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment Collection" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-3 bg-slate-100 dark:bg-slate-700/40 rounded-xl space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Document No:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{document.documentNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Client:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{document.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Bill Amount:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">TSH {document.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 dark:border-slate-600 pt-1 font-bold text-brand-600 dark:text-brand-400">
            <span>Balance Outstanding:</span>
            <span>TSH {balanceLeft.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Amount to Collect (TSH) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            max={balanceLeft}
            min={0.01}
            required
            value={paidAmount}
            onChange={(e) => setPaidAmount(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            <span>{loading ? 'Processing...' : 'Submit Payment'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
