import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { createFile } from '../../services/api';
import { CargoFile, Client } from '../../types';
import { FolderPlus, AlertCircle, Search } from 'lucide-react';

interface CreateFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onSuccess: (newFile: CargoFile) => void;
}

export const CreateFileModal: React.FC<CreateFileModalProps> = ({
  isOpen,
  onClose,
  clients,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    fileDate: new Date().toISOString().split('T')[0],
    fileId: '',
    jobNumber: '',
    clientId: 0,
    supplierName: '',
    awbBl: '',
    reference: '',
    description: '',
    vessel: '',
    placeOfLoading: '',
  });
  const [selectedClientName, setSelectedClientName] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.clientId.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fileId.trim() || !formData.jobNumber.trim() || !formData.clientId) {
      setError('Date, File ID, Job Number and Client are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const created = await createFile(formData);
      onSuccess(created);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create job file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Open New Job File" maxWidth="2xl">
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
              File Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.fileDate}
              onChange={(e) => setFormData({ ...formData, fileDate: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              File ID (Code) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 818"
              required
              value={formData.fileId}
              onChange={(e) => setFormData({ ...formData, fileId: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Job Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. JOB-2026-09"
              required
              value={formData.jobNumber}
              onChange={(e) => setFormData({ ...formData, jobNumber: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        {/* Client Selection */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Client <span className="text-rose-500">*</span>
          </label>
          <div
            onClick={() => setShowClientPicker(!showClientPicker)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer flex justify-between items-center dark:text-white"
          >
            <span>{selectedClientName || 'Click to select a client...'}</span>
            <Search className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {showClientPicker && (
            <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 max-h-56 overflow-y-auto">
              <input
                type="text"
                placeholder="Type client name or ID..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md mb-2 focus:outline-none dark:text-white"
                autoFocus
              />
              <div className="space-y-1">
                {filteredClients.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setFormData({ ...formData, clientId: c.id });
                      setSelectedClientName(`${c.clientId} - ${c.name}`);
                      setShowClientPicker(false);
                    }}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-lg cursor-pointer text-xs flex items-center justify-between transition-colors"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{c.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{c.clientId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Supplier Name
            </label>
            <input
              type="text"
              placeholder="Supplier name"
              value={formData.supplierName}
              onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              AWB / BL Number
            </label>
            <input
              type="text"
              placeholder="AWB/BL reference"
              value={formData.awbBl}
              onChange={(e) => setFormData({ ...formData, awbBl: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reference
            </label>
            <input
              type="text"
              placeholder="Reference code"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Vessel
            </label>
            <input
              type="text"
              placeholder="Vessel name"
              value={formData.vessel}
              onChange={(e) => setFormData({ ...formData, vessel: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Place of Loading
            </label>
            <input
              type="text"
              placeholder="e.g. DUBAI, UAE"
              value={formData.placeOfLoading}
              onChange={(e) => setFormData({ ...formData, placeOfLoading: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description of Goods
          </label>
          <textarea
            rows={2}
            placeholder="Cargo details and container descriptions..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white resize-none"
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
            className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-md shadow-brand-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FolderPlus className="w-4 h-4" />
            <span>{loading ? 'Opening File...' : 'Save Job File'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
