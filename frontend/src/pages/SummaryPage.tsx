import React, { useEffect, useState } from 'react';
import { getSummary, getClients } from '../services/api';
import { SummaryData, Client } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { BarChart3, Filter, ChevronDown, ChevronUp, FileText, CreditCard, RotateCcw } from 'lucide-react';

export const SummaryPage: React.FC = () => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const [filters, setFilters] = useState({
    from: '',
    to: '',
    fileNo: '',
    clientId: '',
    type: '',
  });

  const [visibleCount, setVisibleCount] = useState(25);

  const fetchData = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const clientIdNum = currentFilters.clientId ? Number(currentFilters.clientId) : undefined;
      const data = await getSummary({
        from: currentFilters.from,
        to: currentFilters.to,
        fileNo: currentFilters.fileNo,
        clientId: clientIdNum,
        type: currentFilters.type,
      });
      setSummaryData(data);
      setVisibleCount(25);
    } catch (err) {
      console.error('Error loading summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    getClients().then(setClients).catch(console.error);
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleReset = () => {
    const reset = { from: '', to: '', fileNo: '', clientId: '', type: '' };
    setFilters(reset);
    fetchData(reset);
  };

  const toggleDetails = (itemId: string) => {
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-500" /> Financial Itemized Summary
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Comprehensive item revenue breakdown and contributing document drill-down audit.
        </p>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleFilterSubmit} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Date From</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Date To</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">File Number</label>
            <input
              type="text"
              placeholder="e.g. 817"
              value={filters.fileNo}
              onChange={(e) => setFilters({ ...filters, fileNo: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Client</label>
            <select
              value={filters.clientId}
              onChange={(e) => setFilters({ ...filters, clientId: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white"
            >
              <option value="">All Clients</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Document Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none dark:text-white"
            >
              <option value="">All Documents</option>
              <option value="invoice">Invoice</option>
              <option value="debit_note">Debit Note</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <button
            type="button"
            onClick={handleReset}
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
      </form>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-28 rounded-2xl" />)
        ) : (
          <>
            <StatCard
              title="Total Invoices"
              value={summaryData?.kpi.invoiceCount || 0}
              icon={FileText}
              colorScheme="blue"
              subtitle="Filtered invoice count"
            />
            <StatCard
              title="Invoice Total Value"
              value={`TSH ${(summaryData?.kpi.invoiceTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={BarChart3}
              colorScheme="emerald"
              subtitle="Sum of invoice line items"
            />
            <StatCard
              title="Total Debit Notes"
              value={summaryData?.kpi.debitCount || 0}
              icon={CreditCard}
              colorScheme="amber"
              subtitle="Filtered debit note count"
            />
            <StatCard
              title="Debit Note Total Value"
              value={`TSH ${(summaryData?.kpi.debitTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={BarChart3}
              colorScheme="rose"
              subtitle="Sum of debit note line items"
            />
          </>
        )}
      </div>

      {/* Itemized Summary Breakdown Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Itemized Revenue Breakdown</h3>
          <span className="text-xs text-slate-500 font-medium">Click details button to view contributing documents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Item Name</th>
                <th className="p-4 text-right">Invoice Total (TSH)</th>
                <th className="p-4 text-right">Debit Note Total (TSH)</th>
                <th className="p-4 text-center w-24">Drill Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 font-medium">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="p-4"><Skeleton className="h-4 w-48" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-28 ml-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-28 ml-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-12 mx-auto" /></td>
                  </tr>
                ))
              ) : summaryData?.items.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState title="No Line Items Found" description="No line items match your current filter parameters." />
                  </td>
                </tr>
              ) : (
                summaryData?.items.slice(0, visibleCount).map((item) => {
                  const isExpanded = Boolean(expandedItems[item.itemId]);
                  return (
                    <React.Fragment key={item.itemId}>
                      <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">{item.itemName}</td>
                        <td className="p-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          {item.invoiceTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right font-mono text-rose-600 dark:text-rose-400 font-bold">
                          {item.debitTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => toggleDetails(item.itemId)}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                          >
                            <span>Details</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>

                      {/* Collapsible Contributing Details Table */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80 dark:bg-slate-800/80">
                          <td colSpan={4} className="p-4 border-t border-b border-slate-200 dark:border-slate-700">
                            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
                              <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                Contributing Documents for: "{item.itemName}"
                              </h5>
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="border-b border-slate-200 dark:border-slate-700 font-bold text-slate-500">
                                    <th className="py-2">Document No</th>
                                    <th className="py-2">File Code</th>
                                    <th className="py-2">Document Type</th>
                                    <th className="py-2 text-right">Amount (TSH)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                  {item.details.map((det, dIdx) => (
                                    <tr key={dIdx}>
                                      <td className="py-2 font-mono font-bold text-brand-600 dark:text-brand-400">{det.documentNumber}</td>
                                      <td className="py-2 font-mono text-slate-600 dark:text-slate-300">#{det.fileId}</td>
                                      <td className="py-2 capitalize text-slate-700 dark:text-slate-300">{det.documentType.replace('_', ' ')}</td>
                                      <td className="py-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                                        {det.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Load More Pagination Bar */}
        {(summaryData?.items.length || 0) > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Showing <strong className="text-slate-900 dark:text-white">{Math.min(visibleCount, summaryData?.items.length || 0)}</strong> of <strong className="text-slate-900 dark:text-white">{summaryData?.items.length}</strong> revenue line items
            </span>

            {(summaryData?.items.length || 0) > visibleCount && (
              <div className="flex gap-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 25)}
                  className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg shadow transition-colors"
                >
                  Load More Rows (+25)
                </button>
                <button
                  onClick={() => setVisibleCount(summaryData?.items.length || 0)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition-colors"
                >
                  Show All ({summaryData?.items.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
