import React, { useEffect, useState } from 'react';
import { getPayments } from '../services/api';
import { Document } from '../types';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { MarkPaymentModal } from '../components/payments/MarkPaymentModal';
import { CreditCard, DollarSign, Search, CheckCircle2, AlertCircle } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalLeftToCollect, setTotalLeftToCollect] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [search, setSearch] = useState('');

  const [visibleCount, setVisibleCount] = useState(25);

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      const data = await getPayments();
      setTotalLeftToCollect(data.totalLeftToCollect);
      setDocuments(data.documents);
      setVisibleCount(25);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const filteredDocs = documents.filter(
    (d) =>
      (d.documentNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.clientName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-500" /> Payments & Collection Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track customer paid balances, remaining outstanding dues, and record payment collections.
          </p>
        </div>
      </div>

      {/* KPI Highlight Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 rounded-2xl text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider block">
            TOTAL OUTSTANDING TO COLLECT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-1 font-sans">
            TSH {totalLeftToCollect.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1">Sum of unpaid balances across all active invoices & debit notes</p>
        </div>
        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md hidden sm:block">
          <DollarSign className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search payments by Document No or Client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Ledger Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Document No</th>
                <th className="p-4">Type</th>
                <th className="p-4">Client Name</th>
                <th className="p-4 text-right">Total (TSH)</th>
                <th className="p-4 text-right">Paid (TSH)</th>
                <th className="p-4 text-right">Balance (TSH)</th>
                <th className="p-4 text-center">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 font-medium">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24 ml-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24 ml-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24 ml-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-20 mx-auto" /></td>
                  </tr>
                ))
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      title="No Payment Records"
                      description="No document balances match your search query."
                    />
                  </td>
                </tr>
              ) : (
                filteredDocs.slice(0, visibleCount).map((doc) => {
                  const isInvoice = doc.documentType.toLowerCase().includes('invoice');
                  const isFullyPaid = doc.balance <= 0;

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{doc.documentNumber}</td>
                      <td className="p-4">
                        <Badge variant={isInvoice ? 'blue' : 'rose'} size="sm">
                          {isInvoice ? 'INVOICE' : 'DEBIT NOTE'}
                        </Badge>
                      </td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{doc.clientName}</td>
                      <td className="p-4 text-right font-mono font-semibold text-slate-900 dark:text-white">
                        {doc.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {(doc.paidAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`p-4 text-right font-mono font-bold ${isFullyPaid ? 'text-slate-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {doc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-center">
                        {isFullyPaid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Fully Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedDoc(doc)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <CreditCard className="w-3.5 h-3.5" /> Mark Paid
                          </button>
                        )}
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
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Showing <strong className="text-slate-900 dark:text-white">{Math.min(visibleCount, filteredDocs.length)}</strong> of <strong className="text-slate-900 dark:text-white">{filteredDocs.length}</strong> payment ledger records
            </span>

            {filteredDocs.length > visibleCount && (
              <div className="flex gap-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 25)}
                  className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg shadow transition-colors"
                >
                  Load More Rows (+25)
                </button>
                <button
                  onClick={() => setVisibleCount(filteredDocs.length)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition-colors"
                >
                  Show All ({filteredDocs.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <MarkPaymentModal
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        document={selectedDoc}
        onSuccess={() => fetchPaymentsData()}
      />
    </div>
  );
};
