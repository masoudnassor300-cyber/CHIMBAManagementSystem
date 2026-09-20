import React, { useEffect, useState } from 'react';
import { getClients } from '../services/api';
import { Client } from '../types';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { CreateClientModal } from '../components/clients/CreateClientModal';
import { Users, Search, Plus, Mail, Building, MapPin, Hash, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

type SortField = 'clientId' | 'name' | 'tin' | 'fileCount';
type SortOrder = 'asc' | 'desc';

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [visibleCount, setVisibleCount] = useState(25);

  const fetchClients = async (query?: string) => {
    try {
      setLoading(true);
      const data = await getClients(query);
      setClients(data);
      setVisibleCount(25);
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(search);
  }, [search]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    let res = 0;
    if (sortField === 'fileCount') {
      res = (a.fileCount || 0) - (b.fileCount || 0);
    } else if (sortField === 'clientId') {
      const aVal = String(a.clientId || '');
      const bVal = String(b.clientId || '');
      res = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
    } else {
      const aVal = String(a[sortField] || '').toLowerCase();
      const bVal = String(b[sortField] || '').toLowerCase();
      res = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
    }

    return sortOrder === 'asc' ? res : -res;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-brand-600 dark:text-brand-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-brand-600 dark:text-brand-400" />
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-500" /> Clients Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage customer accounts, tax identity numbers, and job file metrics with instant column sorting.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-brand-500/25 transition-all self-start sm:self-auto border border-white/20"
        >
          <Plus className="w-4 h-4" /> Add New Client
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel p-4 rounded-3xl flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients by name, client ID, city or TIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs glass-input rounded-xl focus:outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/30 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-extrabold uppercase border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm select-none">
              <tr>
                <th className="p-4 cursor-pointer hover:text-brand-600" onClick={() => handleSort('clientId')}>
                  <div className="flex items-center gap-1.5">
                    <span>Client ID</span>
                    {renderSortIcon('clientId')}
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-brand-600" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    <span>Company / Name</span>
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th className="p-4">
                  <span>Address</span>
                </th>
                <th className="p-4">
                  <span>City</span>
                </th>
                <th className="p-4">
                  <span>Email</span>
                </th>
                <th className="p-4 cursor-pointer hover:text-brand-600" onClick={() => handleSort('tin')}>
                  <div className="flex items-center gap-1.5">
                    <span>TIN</span>
                    {renderSortIcon('tin')}
                  </div>
                </th>
                <th className="p-4 text-center cursor-pointer hover:text-brand-600" onClick={() => handleSort('fileCount')}>
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Files</span>
                    {renderSortIcon('fileCount')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 font-medium">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-10 mx-auto" /></td>
                  </tr>
                ))
              ) : sortedClients.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      title="No clients found"
                      description="No client records matched your search query."
                      action={
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-semibold"
                        >
                          Add Client
                        </button>
                      }
                    />
                  </td>
                </tr>
              ) : (
                sortedClients.slice(0, visibleCount).map((client) => (
                  <tr key={client.id} className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all duration-200">
                    <td className="p-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                      <div className="flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-slate-400" />
                        {client.clientId}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{client.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{client.address || '-'}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.city || '-'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.email || '-'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-mono">{client.tin || '-'}</td>
                    <td className="p-4 text-center">
                      <Badge variant="blue">{client.fileCount || 0} Files</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Load More Batch Footer */}
        {sortedClients.length > 0 && (
          <div className="p-4 border-t border-slate-900/10 dark:border-white/10 bg-slate-900/[0.02] dark:bg-white/[0.02] backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Showing <strong className="text-slate-900 dark:text-white">{Math.min(visibleCount, sortedClients.length)}</strong> of <strong className="text-slate-900 dark:text-white">{sortedClients.length}</strong> clients (Sorted by {sortField} {sortOrder === 'asc' ? '↑' : '↓'})
            </span>

            {sortedClients.length > visibleCount && (
              <div className="flex gap-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 25)}
                  className="px-4 py-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all border border-white/20"
                >
                  Load More Rows (+25)
                </button>
                <button
                  onClick={() => setVisibleCount(sortedClients.length)}
                  className="px-3 py-1.5 bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all border border-slate-900/10 dark:border-white/10 backdrop-blur-sm"
                >
                  Show All ({sortedClients.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchClients(search)}
      />
    </div>
  );
};

