import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { createClient } from '../../services/api';
import { Client } from '../../types';
import { UserPlus, AlertCircle } from 'lucide-react';

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newClient: Client) => void;
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    clientId: '',
    name: '',
    address: '',
    city: '',
    email: '',
    tin: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId.trim() || !formData.name.trim()) {
      setError('Client ID and Name are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const created = await createClient(formData);
      onSuccess(created);
      setFormData({ clientId: '', name: '', address: '', city: '', email: '', tin: '' });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create client.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Client" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Client ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. C-18"
              required
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-3 py-2 text-xs glass-input rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Client Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Full Company / Person Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs glass-input rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Postal Address
          </label>
          <input
            type="text"
            placeholder="P.O. BOX ..."
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 text-xs glass-input rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              City
            </label>
            <input
              type="text"
              placeholder="e.g. DAR ES SALAAM"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 text-xs glass-input rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="client@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-xs glass-input rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              TIN Number
            </label>
            <input
              type="text"
              placeholder="xxx-xxx-xxx"
              value={formData.tin}
              onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
              className="w-full px-3 py-2 text-xs glass-input rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
            />
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
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Client'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

