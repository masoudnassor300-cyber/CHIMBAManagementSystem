import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { updateDocument, getDocumentById } from '../../services/api';
import { Document } from '../../types';
import { Edit3, Plus, Trash2, AlertCircle } from 'lucide-react';

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onSuccess: (updatedDoc: Document) => void;
}

export const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  isOpen,
  onClose,
  document,
  onSuccess,
}) => {
  if (!document) return null;

  const [transportType, setTransportType] = useState(document.transportType || 'Sea Port');
  const [fileDate, setFileDate] = useState(document.fileDate || '');
  const [items, setItems] = useState<{ itemName: string; qty: number; unitPrice: number }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDocDetails, setLoadingDocDetails] = useState(false);

  useEffect(() => {
    if (document && isOpen) {
      setTransportType(document.transportType || 'Sea Port');
      setFileDate(document.fileDate || '');
      setError('');

      if (document.items && document.items.length > 0) {
        setItems(
          document.items.map((i) => ({
            itemName: i.itemName,
            qty: Number(i.qty) || 1,
            unitPrice: Number(i.unitPrice) || 0,
          }))
        );
      } else {
        setLoadingDocDetails(true);
        getDocumentById(document.id)
          .then((fullDoc) => {
            if (fullDoc.items && fullDoc.items.length > 0) {
              setItems(
                fullDoc.items.map((i) => ({
                  itemName: i.itemName,
                  qty: Number(i.qty) || 1,
                  unitPrice: Number(i.unitPrice) || 0,
                }))
              );
            }
          })
          .catch((err) => console.error('Error loading document items:', err))
          .finally(() => setLoadingDocDetails(false));
      }
    }
  }, [document, isOpen]);

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { itemName: '', qty: 1, unitPrice: 0 }]);
  };

  const removeItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateGrandTotal = () => {
    return items.reduce((sum, item) => {
      const q = Number(item.qty) || 0;
      const p = Number(item.unitPrice) || 0;
      return sum + q * p;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter((i) => Number(i.qty) > 0 && Number(i.unitPrice) > 0);
    if (validItems.length === 0) {
      setError('Please add at least one line item with Quantity > 0 and Unit Price > 0.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const updated = await updateDocument(document.id, {
        fileDate,
        transportType,
        clientId: document.clientId,
        items: validItems,
      });

      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to update document.');
    } finally {
      setLoading(false);
    }
  };

  const isInvoice = document.documentType.toLowerCase().includes('invoice');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Document Details (${document.documentNumber})`} maxWidth="4xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-3.5 glass-panel rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Document No</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{document.documentNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Client</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{document.clientName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">File ID</span>
            <span className="font-mono font-bold text-brand-600 dark:text-brand-400">#{document.fileCode}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Type</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{isInvoice ? 'Invoice' : 'Debit Note'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isInvoice && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transport Type
              </label>
              <select
                value={transportType}
                onChange={(e) => setTransportType(e.target.value)}
                className="w-full px-3 py-2 text-xs glass-input rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
              >
                <option value="Airport">Airport</option>
                <option value="Sea Port">Sea Port</option>
                <option value="Road Transport">Road Transport</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              File Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={fileDate}
              onChange={(e) => setFileDate(e.target.value)}
              className="w-full px-3 py-2 text-xs glass-input rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Document Line Items
            </h4>
            <button
              type="button"
              onClick={addItemRow}
              className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>

          {loadingDocDetails ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading line items...</div>
          ) : (
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-2.5">Item Name</th>
                    <th className="p-2.5 w-24">Qty</th>
                    <th className="p-2.5 w-32">Unit Price (TSH)</th>
                    <th className="p-2.5 w-32 text-right">Line Total (TSH)</th>
                    <th className="p-2.5 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                  {items.map((item, idx) => {
                    const lineTotal = (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)}
                            placeholder="Item description"
                            className="w-full px-2 py-1 text-xs glass-input rounded-lg focus:outline-none dark:text-white"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.qty}
                            onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                            className="w-full px-2 py-1 text-xs glass-input rounded-lg focus:outline-none dark:text-white text-center"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                            className="w-full px-2 py-1 text-xs glass-input rounded-lg focus:outline-none dark:text-white text-right"
                          />
                        </td>
                        <td className="p-2 text-right font-semibold text-slate-800 dark:text-slate-200 font-mono">
                          {lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeItemRow(idx)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end items-center gap-4 mt-3 px-3 py-2.5 bg-slate-900/5 dark:bg-white/5 rounded-xl border border-slate-900/10 dark:border-white/10 backdrop-blur-md">
            <span className="text-xs font-bold text-slate-500 uppercase">Updated Document Total:</span>
            <span className="text-xl font-extrabold text-brand-600 dark:text-brand-400 font-mono">
              TSH {calculateGrandTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

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
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 disabled:opacity-50 border border-white/20"
          >
            <Edit3 className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Document Changes'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
