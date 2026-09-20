import React, { useEffect, useState } from 'react';
import { getPayments } from '../services/api';
import { Document, PaymentRecord } from '../types';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { StatCard } from '../components/ui/StatCard';
import { MarkPaymentModal } from '../components/payments/MarkPaymentModal';
import { PaymentHistoryModal } from '../components/payments/PaymentHistoryModal';
import { 
  CreditCard, 
  DollarSign, 
  Search, 
  CheckCircle2, 
  History, 
  FileText, 
  TrendingUp, 
  Plus, 
  Filter,
  ArrowUpRight
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalLeftToCollect, setTotalLeftToCollect] = useState<number>(0);
  const [totalInvoicesValue, setTotalInvoicesValue] = useState<number>(0);
  const [totalDebitNotesValue, setTotalDebitNotesValue] = useState<number>(0);
  const [totalCollectedValue, setTotalCollectedValue] = useState<number>(0);
  const [totalOverpaymentValue, setTotalOverpaymentValue] = useState<number>(0);
  const [recentPayments, setRecentPayments] = useState<PaymentRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedRecordDoc, setSelectedRecordDoc] = useState<Document | null>(null);
  const [selectedHistoryDoc, setSelectedHistoryDoc] = useState<Document | null>(null);
  
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unpaid' | 'paid' | 'invoice' | 'debit_note'>('all');
  const [visibleCount, setVisibleCount] = useState(25);

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      const data = await getPayments();
      setTotalLeftToCollect(data.totalLeftToCollect || 0);
      setTotalInvoicesValue(data.totalInvoicesValue || 0);
      setTotalDebitNotesValue(data.totalDebitNotesValue || 0);
      setTotalCollectedValue(data.totalCollectedValue || 0);
      setTotalOverpaymentValue(data.totalOverpaymentValue || 0);
      setDocuments(data.documents || []);
      setRecentPayments(data.recentPayments || []);
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

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      (d.documentNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.clientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.fileCode || '').toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    const isInvoice = d.documentType.toLowerCase().includes('invoice');
    const isPaid = d.status === 'PAID' || d.balance <= 0;
    const isUnpaid = d.status !== 'PAID' && d.balance > 0;

    if (activeTab === 'unpaid') return isUnpaid;
    if (activeTab === 'paid') return isPaid;
    if (activeTab === 'invoice') return isInvoice;
    if (activeTab === 'debit_note') return !isInvoice;

    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-500" /> Payments & Collection Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Independent document-level payment tracking for Tax Invoices and Debit Notes.
          </p>
        </div>
      </div>

      {/* KPI Highlight Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Outstanding To Collect"
          value={`TSH ${totalLeftToCollect.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={DollarSign}
          colorScheme="rose"
          subtitle="Net unpaid balances"
        />
        <StatCard
          title="Total Payments Collected"
          value={`TSH ${totalCollectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={CheckCircle2}
          colorScheme="emerald"
          subtitle="Total recorded collections"
        />
        <StatCard
          title="Overpayment / Credit Total"
          value={`TSH ${totalOverpaymentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={TrendingUp}
          colorScheme="amber"
          subtitle="Excess payments collected"
        />
        <StatCard
          title="Invoices Billed Total"
          value={`TSH ${totalInvoicesValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={FileText}
          colorScheme="blue"
          subtitle="Sum of taxable invoices"
        />
        <StatCard
          title="Debit Notes Total"
          value={`TSH ${totalDebitNotesValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={CreditCard}
          colorScheme="indigo"
          subtitle="Sum of reimbursables"
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Documents ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('unpaid')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'unpaid'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Unpaid / Partial
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'paid'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Fully Paid
          </button>
          <button
            onClick={() => setActiveTab('invoice')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'invoice'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Invoices Only
          </button>
          <button
            onClick={() => setActiveTab('debit_note')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'debit_note'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Debit Notes Only
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Doc No, File ID, or Client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs glass-input rounded-xl focus:outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Main Document Payments Table */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-extrabold uppercase border-b border-slate-900/10 dark:border-white/10 backdrop-blur-sm">
              <tr>
                <th className="p-4">Document No</th>
                <th className="p-4">Type</th>
                <th className="p-4">File ID</th>
                <th className="p-4">Client Name</th>
                <th className="p-4 text-right">Total (TSH)</th>
                <th className="p-4 text-right">Paid (TSH)</th>
                <th className="p-4 text-right">Outstanding (TSH)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 font-medium">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-36" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24 ml-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24 ml-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24 ml-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-20 mx-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24 mx-auto" /></td>
                  </tr>
                ))
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState
                      title="No Payment Records Found"
                      description="No document records match your current filter or search criteria."
                    />
                  </td>
                </tr>
              ) : (
                filteredDocs.slice(0, visibleCount).map((doc) => {
                  const isInvoice = doc.documentType.toLowerCase().includes('invoice');
                  const isOverpaid = doc.status === 'OVERPAID' || (doc.overpayment && doc.overpayment > 0);
                  const isFullyPaid = doc.status === 'PAID' || doc.balance <= 0;
                  const isPartiallyPaid = doc.status === 'PARTIALLY_PAID' || (doc.paidAmount > 0 && doc.balance > 0);

                  return (
                    <tr key={doc.id} className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all duration-200">
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                        {doc.documentNumber}
                      </td>
                      <td className="p-4">
                        <Badge variant={isInvoice ? 'blue' : 'rose'} size="sm">
                          {isInvoice ? 'INVOICE' : 'DEBIT NOTE'}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono font-semibold text-brand-600 dark:text-brand-400">
                        #{doc.fileCode}
                      </td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{doc.clientName}</td>
                      <td className="p-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {doc.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {(doc.paidAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`p-4 text-right font-mono font-bold ${isFullyPaid ? 'text-slate-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {doc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-center">
                        {isOverpaid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 backdrop-blur-sm" title={`Overpayment Credit: TSH ${doc.overpayment?.toLocaleString()}`}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Overpaid
                          </span>
                        ) : isFullyPaid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                          </span>
                        ) : isPartiallyPaid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 backdrop-blur-sm">
                            <History className="w-3.5 h-3.5" /> Partial ({Math.round(((doc.paidAmount || 0) / doc.total) * 100)}%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 backdrop-blur-sm">
                            <DollarSign className="w-3.5 h-3.5" /> Unpaid
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedRecordDoc(doc)}
                            className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-all shadow-md shadow-emerald-500/20 border border-white/20"
                          >
                            <Plus className="w-3.5 h-3.5" /> Record
                          </button>
                          <button
                            onClick={() => setSelectedHistoryDoc(doc)}
                            className="px-2.5 py-1.5 bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-all border border-slate-900/10 dark:border-white/10 backdrop-blur-sm"
                            title="View Payment Audit History"
                          >
                            <History className="w-3.5 h-3.5" />
                            <span>History ({doc.paymentsCount || 0})</span>
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

        {/* Load More Batch Footer */}
        {filteredDocs.length > 0 && (
          <div className="p-4 border-t border-slate-900/10 dark:border-white/10 bg-slate-900/[0.02] dark:bg-white/[0.02] backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Showing <strong className="text-slate-900 dark:text-white">{Math.min(visibleCount, filteredDocs.length)}</strong> of <strong className="text-slate-900 dark:text-white">{filteredDocs.length}</strong> payment documents
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

      {/* Record Payment Modal */}
      <MarkPaymentModal
        isOpen={Boolean(selectedRecordDoc)}
        onClose={() => setSelectedRecordDoc(null)}
        document={selectedRecordDoc}
        onSuccess={() => fetchPaymentsData()}
      />

      {/* Payment History Audit Modal */}
      <PaymentHistoryModal
        isOpen={Boolean(selectedHistoryDoc)}
        onClose={() => setSelectedHistoryDoc(null)}
        document={selectedHistoryDoc}
      />
    </div>
  );
};

