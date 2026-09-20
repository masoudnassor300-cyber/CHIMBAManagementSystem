import React, { useEffect, useState } from 'react';
import { getDocuments, getFiles, getDocumentById } from '../services/api';
import { Document, CargoFile } from '../types';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { CreateDocumentModal } from '../components/documents/CreateDocumentModal';
import { EditDocumentModal } from '../components/documents/EditDocumentModal';
import { PrintDocumentView } from '../components/documents/PrintDocumentView';
import { FileText, Plus, Search, Filter, Printer, Edit3, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [files, setFiles] = useState<CargoFile[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalInitialType, setModalInitialType] = useState<'Invoice' | 'Debit_Note'>('Invoice');
  const [printDocument, setPrintDocument] = useState<Document | null>(null);
  const [editDocument, setEditDocument] = useState<Document | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filters & Sorting state
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    documentType: '',
    clientName: '',
    sort: 'newest',
  });

  const [search, setSearch] = useState('');

  const [visibleCount, setVisibleCount] = useState(25);

  const fetchDocsData = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const data = await getDocuments(currentFilters);
      setDocuments(data);
      setVisibleCount(25);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocsData();
  }, [filters.sort]);

  const handleOpenCreateModal = async (type: 'Invoice' | 'Debit_Note') => {
    const fetchedFiles = await getFiles();
    setFiles(fetchedFiles);
    setModalInitialType(type);
    setIsCreateModalOpen(true);
  };

  const handlePrintClick = async (docId: number) => {
    try {
      const fullDoc = await getDocumentById(docId);
      setPrintDocument(fullDoc);
    } catch (err) {
      console.error('Error loading print document:', err);
    }
  };

  const handleEditClick = async (doc: Document) => {
    try {
      const fullDoc = await getDocumentById(doc.id);
      setEditDocument(fullDoc);
    } catch (err) {
      setEditDocument(doc);
    }
    setIsEditModalOpen(true);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocsData();
  };

  type DocSortCol = 'doc_no' | 'type' | 'file_id' | 'client' | 'date' | 'total';
  const [sortCol, setSortCol] = useState<DocSortCol>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleColumnSort = (col: DocSortCol) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const filteredDocs = documents
    .filter(
      (d) =>
        (d.documentNumber || '').toLowerCase().includes(search.toLowerCase()) ||
        (d.clientName || '').toLowerCase().includes(search.toLowerCase()) ||
        (d.fileCode || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let res = 0;
      switch (sortCol) {
        case 'doc_no':
          res = (a.documentNumber || '').localeCompare(b.documentNumber || '', undefined, { numeric: true, sensitivity: 'base' });
          break;
        case 'type':
          res = (a.documentType || '').localeCompare(b.documentType || '');
          break;
        case 'file_id':
          res = (a.fileCode || '').localeCompare(b.fileCode || '', undefined, { numeric: true, sensitivity: 'base' });
          break;
        case 'client':
          res = (a.clientName || '').localeCompare(b.clientName || '', undefined, { numeric: true, sensitivity: 'base' });
          break;
        case 'total':
          res = (Number(a.total) || 0) - (Number(b.total) || 0);
          break;
        case 'date':
        default:
          res = (a.fileDate || '').localeCompare(b.fileDate || '');
          break;
      }

      return sortDir === 'asc' ? res : -res;
    });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-500" /> Documents Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage Tax Invoices (`CLL/...`) and Debit Notes (`DN/...`).
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => handleOpenCreateModal('Invoice')}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-brand-500/25 transition-all border border-white/20"
          >
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
          <button
            onClick={() => handleOpenCreateModal('Debit_Note')}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-rose-500/25 transition-all border border-white/20"
          >
            <Plus className="w-4 h-4" /> Create Debit Note
          </button>
        </div>
      </div>

      {/* Filter Box */}
      <form onSubmit={handleFilterSubmit} className="glass-panel p-5 rounded-3xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-1.5 text-xs glass-input rounded-xl focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-1.5 text-xs glass-input rounded-xl focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Document Type</label>
            <select
              value={filters.documentType}
              onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
              className="w-full px-3 py-1.5 text-xs glass-input rounded-xl focus:outline-none dark:text-white"
            >
              <option value="">All Types</option>
              <option value="invoice">Invoice</option>
              <option value="debit_note">Debit Note</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Client Name</label>
            <input
              type="text"
              placeholder="Search client..."
              value={filters.clientName}
              onChange={(e) => setFilters({ ...filters, clientName: e.target.value })}
              className="w-full px-3 py-1.5 text-xs glass-input rounded-xl focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Sort Order</label>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="w-full px-3 py-1.5 text-xs glass-input rounded-xl focus:outline-none dark:text-white font-semibold text-brand-600 dark:text-brand-400"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="doc_no">Document Number</option>
              <option value="type">Type</option>
              <option value="file_id">File ID</option>
              <option value="client">Client Name</option>
              <option value="date">File Date</option>
              <option value="highest">Total: Highest</option>
              <option value="lowest">Total: Lowest</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-900/10 dark:border-white/10">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents table..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs glass-input rounded-xl focus:outline-none dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg shadow-brand-500/20 border border-white/20"
          >
            <Filter className="w-3.5 h-3.5" /> Apply Filters
          </button>
        </div>
      </form>

      {/* Documents Table */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/30 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-extrabold uppercase border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm select-none">
              <tr>
                <th className="p-4 cursor-pointer hover:text-brand-600" onClick={() => handleColumnSort('doc_no')}>
                  <div className="flex items-center gap-1.5">
                    <span>Document No</span>
                    {sortCol === 'doc_no' ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600 dark:text-brand-400" /> : <ArrowDown className="w-3 h-3 text-brand-600 dark:text-brand-400" />) : <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />}
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-brand-600" onClick={() => handleColumnSort('type')}>
                  <div className="flex items-center gap-1.5">
                    <span>Type</span>
                    {sortCol === 'type' ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600 dark:text-brand-400" /> : <ArrowDown className="w-3 h-3 text-brand-600 dark:text-brand-400" />) : <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />}
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-brand-600" onClick={() => handleColumnSort('file_id')}>
                  <div className="flex items-center gap-1.5">
                    <span>File ID</span>
                    {sortCol === 'file_id' ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600 dark:text-brand-400" /> : <ArrowDown className="w-3 h-3 text-brand-600 dark:text-brand-400" />) : <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />}
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-brand-600" onClick={() => handleColumnSort('client')}>
                  <div className="flex items-center gap-1.5">
                    <span>Client Name</span>
                    {sortCol === 'client' ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600 dark:text-brand-400" /> : <ArrowDown className="w-3 h-3 text-brand-600 dark:text-brand-400" />) : <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />}
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-brand-600" onClick={() => handleColumnSort('date')}>
                  <div className="flex items-center gap-1.5">
                    <span>File Date</span>
                    {sortCol === 'date' ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600 dark:text-brand-400" /> : <ArrowDown className="w-3 h-3 text-brand-600 dark:text-brand-400" />) : <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />}
                  </div>
                </th>
                <th className="p-4 text-right cursor-pointer hover:text-brand-600" onClick={() => handleColumnSort('total')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Total (TSH)</span>
                    {sortCol === 'total' ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600 dark:text-brand-400" /> : <ArrowDown className="w-3 h-3 text-brand-600 dark:text-brand-400" />) : <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />}
                  </div>
                </th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 font-medium">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-28 ml-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-16 mx-auto" /></td>
                  </tr>
                ))
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      title="No Documents Found"
                      description="No invoice or debit note records match your filter criteria."
                      action={
                        <button
                          onClick={() => handleOpenCreateModal('Invoice')}
                          className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-semibold"
                        >
                          Create Invoice
                        </button>
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredDocs.slice(0, visibleCount).map((doc) => {
                  const isInvoice = doc.documentType.toLowerCase().includes('invoice');
                  return (
                    <tr key={doc.id} className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all duration-200">
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                        {doc.documentNumber}
                      </td>
                      <td className="p-4">
                        <Badge variant={isInvoice ? 'blue' : 'rose'}>
                          {isInvoice ? 'INVOICE' : 'DEBIT NOTE'}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono font-semibold text-brand-600 dark:text-brand-400">
                        #{doc.fileCode}
                      </td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{doc.clientName}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{doc.fileDate}</td>
                      <td className="p-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {doc.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEditClick(doc)}
                            className="px-2.5 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-all border border-brand-500/20 backdrop-blur-sm"
                            title="Edit Document"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handlePrintClick(doc.id)}
                            className="px-2.5 py-1.5 bg-slate-900/5 dark:bg-white/5 hover:bg-brand-500/10 dark:hover:bg-brand-500/20 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-all border border-slate-900/10 dark:border-white/10 backdrop-blur-sm"
                            title="Print Document"
                          >
                            <Printer className="w-3.5 h-3.5" /> Print
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Load More Pagination Bar */}
        {filteredDocs.length > 0 && (
          <div className="p-4 border-t border-slate-900/10 dark:border-white/10 bg-slate-900/[0.02] dark:bg-white/[0.02] backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Showing <strong className="text-slate-900 dark:text-white">{Math.min(visibleCount, filteredDocs.length)}</strong> of <strong className="text-slate-900 dark:text-white">{filteredDocs.length}</strong> documents
            </span>

            {filteredDocs.length > visibleCount && (
              <div className="flex gap-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 25)}
                  className="px-4 py-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all border border-white/20"
                >
                  Load More Rows (+25)
                </button>
                <button
                  onClick={() => setVisibleCount(filteredDocs.length)}
                  className="px-3 py-1.5 bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all border border-slate-900/10 dark:border-white/10 backdrop-blur-sm"
                >
                  Show All ({filteredDocs.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateDocumentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        files={files}
        initialType={modalInitialType}
        onSuccess={() => fetchDocsData()}
      />

      <EditDocumentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        document={editDocument}
        onSuccess={() => fetchDocsData()}
      />

      {printDocument && (
        <PrintDocumentView
          document={printDocument}
          onClose={() => setPrintDocument(null)}
        />
      )}
    </div>
  );
};

