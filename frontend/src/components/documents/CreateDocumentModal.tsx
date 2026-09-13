import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { createDocument } from '../../services/api';
import { CargoFile, Document } from '../../types';
import { FilePlus, Plus, Trash2, AlertCircle, Search } from 'lucide-react';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: CargoFile[];
  initialType?: 'Invoice' | 'Debit_Note';
  onSuccess: (newDoc: Document) => void;
}

const DEBIT_PRESETS: Record<string, string[]> = {
  Airport: [
    'Swissport / Handling / Storage', 'Consolidation Fees', 'TBS', 'Additional Duty',
    'Amendment Fees', 'Customs Rent', 'Chemical Permits', 'Kilimo', 'Misc', 'Road Transport', 'Magunia/Mbao'
  ],
  'Sea Port': [
    'Shipping Line', 'Demurrage Charges', 'Makbul', 'Transire', 'Consolidation / Handover', 'Port Charges', 'TBS',
    'Amendment Fee', 'Manifest Ammendment', 'Additional Duty', 'Chemical Permit', 'Carmatec',
    'Customs Rent', 'Misc', 'Kilimo', 'Plate Number',
    'Kufuli', 'Petrol', 'Driver', 'Interchange', 'Road Transport', 'Magunia/Mbao', 'TPA/TICTS/ICD Charges'
  ],
  'Road Transport': [
    'Handling', 'TBS', 'Kilimo', 'Transport', 'Consolidation', 'Amendment Fee',
    'Additional Duty', 'Rent', 'Others', 'Misc'
  ]
};

const INVOICE_PRESETS = ['Agency Fees'];

export const CreateDocumentModal: React.FC<CreateDocumentModalProps> = ({
  isOpen,
  onClose,
  files,
  initialType = 'Invoice',
  onSuccess,
}) => {
  const [docType, setDocType] = useState<'Invoice' | 'Debit_Note'>(initialType);
  const [selectedFile, setSelectedFile] = useState<CargoFile | null>(null);
  const [fileSearch, setFileSearch] = useState('');
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [transportType, setTransportType] = useState('Sea Port');
  const [fileDate, setFileDate] = useState(new Date().toISOString().split('T')[0]);

  const [items, setItems] = useState<{ itemName: string; qty: number; unitPrice: number }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDocType(initialType);
  }, [initialType, isOpen]);

  // Handle Preset Population
  const loadPresetItems = () => {
    let presetNames: string[] = [];
    if (docType === 'Invoice') {
      presetNames = INVOICE_PRESETS;
    } else {
      presetNames = DEBIT_PRESETS[transportType] || [];
    }

    setItems(presetNames.map((name) => ({ itemName: name, qty: 1, unitPrice: 0 })));
  };

  useEffect(() => {
    loadPresetItems();
  }, [docType, transportType]);

  const handleFileSelect = (file: CargoFile) => {
    setSelectedFile(file);
    setFileDate(file.fileDate);
    setShowFilePicker(false);
  };

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
    if (!selectedFile) {
      setError('Please search and select a Job File.');
      return;
    }

    const validItems = items.filter((i) => Number(i.qty) > 0 && Number(i.unitPrice) > 0);
    if (validItems.length === 0) {
      setError('Please add at least one line item with Quantity > 0 and Unit Price > 0.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const created = await createDocument({
        documentType: docType,
        fileId: selectedFile.id,
        fileCode: selectedFile.fileId,
        clientId: selectedFile.clientId,
        fileDate,
        transportType: docType === 'Debit_Note' ? transportType : undefined,
        items: validItems,
      });

      onSuccess(created);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create document.');
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter(
    (f) =>
      f.fileId.toLowerCase().includes(fileSearch.toLowerCase()) ||
      f.clientName.toLowerCase().includes(fileSearch.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Create ${docType === 'Invoice' ? 'Invoice' : 'Debit Note'}`} maxWidth="4xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Type
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs glass-input rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white font-semibold"
            >
              <option value="Invoice">Invoice (CLL/...)</option>
              <option value="Debit_Note">Debit Note (DN/...)</option>
            </select>
          </div>

          {docType === 'Debit_Note' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transport Type Preset
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

        {/* File Picker */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Search Cargo Job File <span className="text-rose-500">*</span>
          </label>
          <div
            onClick={() => setShowFilePicker(!showFilePicker)}
            className="w-full px-3 py-2 text-xs glass-input rounded-lg cursor-pointer flex justify-between items-center dark:text-white"
          >
            <span>
              {selectedFile
                ? `File #${selectedFile.fileId} - ${selectedFile.clientName} (Job: ${selectedFile.jobNumber})`
                : 'Type File ID or Client Name to search...'}
            </span>
            <Search className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {showFilePicker && (
            <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 max-h-56 overflow-y-auto">
              <input
                type="text"
                placeholder="Type file code or client name..."
                value={fileSearch}
                onChange={(e) => setFileSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-xs glass-input rounded-md mb-2 focus:outline-none dark:text-white"
                autoFocus
              />
              <div className="space-y-1">
                {filteredFiles.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => handleFileSelect(f)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-lg cursor-pointer text-xs flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-bold text-brand-600 dark:text-brand-400">File #{f.fileId}</span>
                      <span className="text-slate-700 dark:text-slate-300 ml-2 font-medium">{f.clientName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Job: {f.jobNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Details Preview */}
        {selectedFile && (
          <div className="p-3 bg-slate-100 dark:bg-slate-700/40 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border border-slate-200 dark:border-slate-600/60">
            <div>
              <span className="text-slate-400 block text-[10px]">Client</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedFile.clientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Job Number</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedFile.jobNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">AWB / BL</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedFile.awbBl || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Vessel</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedFile.vessel || '-'}</span>
            </div>
          </div>
        )}

        {/* Line Items Table */}
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
                      <td className="p-2 text-right font-semibold text-slate-800 dark:text-slate-200">
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

          <div className="flex justify-end items-center gap-4 mt-3 px-3 py-2.5 bg-slate-900/5 dark:bg-white/5 rounded-xl border border-slate-900/10 dark:border-white/10 backdrop-blur-md">
            <span className="text-xs font-bold text-slate-500 uppercase">Document Total:</span>
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
            <FilePlus className="w-4 h-4" />
            <span>{loading ? 'Generating...' : `Save ${docType === 'Invoice' ? 'Invoice' : 'Debit Note'}`}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

