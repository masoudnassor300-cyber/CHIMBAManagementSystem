import React, { useEffect, useState } from 'react';
import { getFiles, getClients } from '../services/api';
import { CargoFile, Client } from '../types';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { CreateFileModal } from '../components/files/CreateFileModal';
import { FolderKanban, Search, Plus, Filter, RotateCcw, Calendar, FileCode, Ship } from 'lucide-react';

export const FilesPage: React.FC = () => {
  const [files, setFiles] = useState<CargoFile[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    fileFrom: '',
    fileTo: '',
    customerName: '',
  });

  const [search, setSearch] = useState('');

  const [visibleCount, setVisibleCount] = useState(25);

  const fetchFilesData = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const data = await getFiles(currentFilters);
      setFiles(data);
      setVisibleCount(25);
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilesData();
  }, []);

  const handleOpenModal = async () => {
    const fetchedClients = await getClients();
    setClients(fetchedClients);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    const reset = { dateFrom: '', dateTo: '', fileFrom: '', fileTo: '', customerName: '' };
    setFilters(reset);
    fetchFilesData(reset);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilesData();
  };

  const filteredFiles = files.filter(
    (f) =>
      f.fileId.toLowerCase().includes(search.toLowerCase()) ||
      f.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (f.jobNumber && f.jobNumber.toLowerCase().includes(search.toLowerCase())) ||
      (f.awbBl && f.awbBl.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-500" /> Cargo Job Files Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track cargo clearance files, job numbers, AWB/BL shipping documents and vessels.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-brand-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Open New Job File
        </button>
      </div>

      {/* Advanced Filter Box */}
      <form onSubmit={handleFilterSubmit} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-brand-500" /> Filter Criteria
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">File ID From</label>
            <input
              type="text"
              placeholder="e.g. 800"
              value={filters.fileFrom}
              onChange={(e) => setFilters({ ...filters, fileFrom: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">File ID To</label>
            <input
              type="text"
              placeholder="e.g. 850"
              value={filters.fileTo}
              onChange={(e) => setFilters({ ...filters, fileTo: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Customer Name</label>
            <input
              type="text"
              placeholder="Search customer..."
              value={filters.customerName}
              onChange={(e) => setFilters({ ...filters, customerName: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Quick search in files table..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-slate-100 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
            >
              <Filter className="w-3.5 h-3.5" /> Apply Filters
            </button>
          </div>
        </div>
      </form>

      {/* Files Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">File ID</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">AWB / BL</th>
                <th className="p-4">Job Number</th>
                <th className="p-4">File Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 font-medium">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-48" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                  </tr>
                ))
              ) : filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      title="No Job Files Found"
                      description="No job files matched your search or filter parameters."
                      action={
                        <button
                          onClick={handleOpenModal}
                          className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-semibold"
                        >
                          Open Job File
                        </button>
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredFiles.slice(0, visibleCount).map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                      <div className="flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-slate-400" />
                        <span>#{file.fileId}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{file.clientName}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Ship className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{file.awbBl || '-'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-mono">{file.jobNumber}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{file.fileDate}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Load More Pagination Bar */}
        {filteredFiles.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Showing <strong className="text-slate-900 dark:text-white">{Math.min(visibleCount, filteredFiles.length)}</strong> of <strong className="text-slate-900 dark:text-white">{filteredFiles.length}</strong> job files
            </span>

            {filteredFiles.length > visibleCount && (
              <div className="flex gap-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 25)}
                  className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg shadow transition-colors"
                >
                  Load More Rows (+25)
                </button>
                <button
                  onClick={() => setVisibleCount(filteredFiles.length)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition-colors"
                >
                  Show All ({filteredFiles.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateFileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clients={clients}
        onSuccess={() => fetchFilesData()}
      />
    </div>
  );
};
