import React, { useEffect, useState } from 'react';
import { getSummary, getClients } from '../services/api';
import { SummaryData, Client } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useTheme } from '../context/ThemeContext';
import { 
  BarChart3, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  CreditCard, 
  RotateCcw,
  PieChart as PieIcon,
  Calendar,
  TrendingUp,
  Coins
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const SummaryPage: React.FC = () => {
  const { theme } = useTheme();
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [activeTimeRange, setActiveTimeRange] = useState<'7d' | 'month' | 'year' | 'all'>('all');

  // Dynamic Theme Colors for Charts
  const gridStroke = theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
  const axisTextColor = theme === 'dark' ? '#94a3b8' : '#64748b';

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
    setActiveTimeRange('all');
    fetchData();
  };

  const handleReset = () => {
    const reset = { from: '', to: '', fileNo: '', clientId: '', type: '' };
    setFilters(reset);
    setActiveTimeRange('all');
    fetchData(reset);
  };

  const handleTimeRangePreset = (range: '7d' | 'month' | 'year' | 'all') => {
    setActiveTimeRange(range);
    const today = new Date();
    let fromDate = '';
    let toDate = today.toISOString().split('T')[0];

    if (range === '7d') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      fromDate = d.toISOString().split('T')[0];
    } else if (range === 'month') {
      const d = new Date(today.getFullYear(), today.getMonth(), 1);
      fromDate = d.toISOString().split('T')[0];
    } else if (range === 'year') {
      const d = new Date(today.getFullYear(), 0, 1);
      fromDate = d.toISOString().split('T')[0];
    } else if (range === 'all') {
      fromDate = '';
      toDate = '';
    }

    const newFilters = { ...filters, from: fromDate, to: toDate };
    setFilters(newFilters);
    fetchData(newFilters);
  };

  const toggleDetails = (itemId: string) => {
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Prepare Bar Chart Data (Top 8 items by revenue)
  const barChartData = (summaryData?.items || []).slice(0, 8).map((item) => ({
    name: item.itemName.length > 18 ? `${item.itemName.slice(0, 16)}...` : item.itemName,
    fullName: item.itemName,
    Invoices: item.invoiceTotal,
    DebitNotes: item.debitTotal,
  }));

  // Prepare Pie Chart Data
  const pieChartData = summaryData ? [
    { name: 'Tax Invoices', value: summaryData.kpi.invoiceTotal || 0, color: '#2563eb' },
    { name: 'Debit Notes (Reimbursable)', value: summaryData.kpi.debitTotal || 0, color: '#dc2626' },
  ].filter(d => d.value > 0) : [];

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
      <form onSubmit={handleFilterSubmit} className="glass-panel p-5 rounded-3xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Date From</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-slate-700/60 rounded-xl focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Date To</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-slate-700/60 rounded-xl focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">File Number</label>
            <input
              type="text"
              placeholder="e.g. 817"
              value={filters.fileNo}
              onChange={(e) => setFilters({ ...filters, fileNo: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-slate-700/60 rounded-xl focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Client</label>
            <select
              value={filters.clientId}
              onChange={(e) => setFilters({ ...filters, clientId: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-slate-700/60 rounded-xl focus:outline-none dark:text-white"
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
              className="w-full px-3 py-1.5 text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-slate-700/60 rounded-xl focus:outline-none dark:text-white"
            >
              <option value="">All Documents</option>
              <option value="invoice">Invoice</option>
              <option value="debit_note">Debit Note</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-slate-900/10 dark:border-white/10">
          {/* Time Preset Horizon Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900/5 dark:bg-white/5 p-1.5 rounded-2xl backdrop-blur-md border border-slate-900/10 dark:border-white/10">
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-500" /> Horizon:
            </span>
            {[
              { key: '7d', label: '7 Days' },
              { key: 'month', label: 'This Month' },
              { key: 'year', label: 'This Year' },
              { key: 'all', label: 'All Time' },
            ].map((btn) => (
              <button
                key={btn.key}
                type="button"
                onClick={() => handleTimeRangePreset(btn.key as any)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                  activeTimeRange === btn.key
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25 border border-white/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/10'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all backdrop-blur-md border border-slate-900/10 dark:border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg shadow-brand-600/25 border border-white/20"
            >
              <Filter className="w-3.5 h-3.5" /> Apply Filters
            </button>
          </div>
        </div>
      </form>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => <Skeleton key={idx} className="h-28 rounded-2xl" />)
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
            <StatCard
              title="Overpayment / Credit Balance"
              value={`TSH ${(summaryData?.kpi.overpaymentTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={TrendingUp}
              colorScheme="indigo"
              subtitle="Excess payments collected"
            />
          </>
        )}
      </div>

      {/* Interactive Financial Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Positive vs Negative Item Revenue Comparison Bar Chart */}
        <div className="lg:col-span-7 backdrop-blur-md bg-white/10 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/50 rounded-2xl shadow-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-500" /> Revenue vs Disbursement Breakdown by Item
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tax Invoices (+ Taxable Fees) vs Debit Notes (- Reimbursables)
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-full border border-brand-500/20">
                Top Revenue Drivers
              </span>
            </div>

            {loading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : barChartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                No revenue data available for selected filter.
              </div>
            ) : (
              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                    <CartesianGrid stroke={gridStroke} strokeDasharray="4 4" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: axisTextColor, fontSize: 10 }} 
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: axisTextColor, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => val >= 1000000 ? `${(val/1000000).toFixed(1)}M` : val >= 1000 ? `${(val/1000).toFixed(0)}K` : val}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border border-white/30 dark:border-slate-700/30 p-3 rounded-xl shadow-lg text-xs space-y-1.5">
                              <p className="font-extrabold text-slate-900 dark:text-white border-b border-slate-900/10 dark:border-white/10 pb-1 mb-1">{data.fullName}</p>
                              <div className="flex justify-between gap-5 text-emerald-500 font-bold">
                                <span>Invoices (+):</span>
                                <span className="font-mono">TSH {data.Invoices.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between gap-5 text-rose-500 font-bold">
                                <span>Debit Notes (-):</span>
                                <span className="font-mono">TSH {data.DebitNotes.toLocaleString()}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="Invoices" name="Tax Invoices (Revenue)" fill="#2563eb" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="DebitNotes" name="Debit Notes (Disbursements)" fill="#dc2626" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Financial Distribution Pie Chart (7 Days / Month / Year Filter) */}
        <div className="lg:col-span-5 backdrop-blur-md bg-white/10 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/50 rounded-2xl shadow-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-emerald-500" /> Revenue Ratio Share
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Proportion across current filter ({activeTimeRange === '7d' ? 'Last 7 Days' : activeTimeRange === 'month' ? 'This Month' : activeTimeRange === 'year' ? 'This Year' : 'All Time'})
                </p>
              </div>
              <Coins className="w-4 h-4 text-amber-500" />
            </div>

            {loading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : pieChartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                No revenue distribution available.
              </div>
            ) : (
              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={82}
                      paddingAngle={6}
                      cornerRadius={8}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0];
                          return (
                            <div className="backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border border-white/30 dark:border-slate-700/30 p-3 rounded-xl shadow-lg text-xs font-bold text-slate-900 dark:text-white">
                              <p className="font-extrabold mb-1" style={{ color: (d.payload as any)?.color }}>{d.name}</p>
                              <p className="font-mono">TSH {Number(d.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Itemized Summary Breakdown Table */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Itemized Revenue Breakdown</h3>
          <span className="text-xs text-slate-500 font-medium">Click details button to view contributing documents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/30 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-extrabold uppercase border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
              <tr>
                <th className="p-4">Item Name</th>
                <th className="p-4 text-right">Invoice Total (TSH)</th>
                <th className="p-4 text-right">Debit Note Total (TSH)</th>
                <th className="p-4 text-center w-24">Drill Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-700/40 font-medium">
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
                      <tr className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all duration-200">
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
                            className="px-3 py-1.5 bg-white/50 dark:bg-slate-700/50 hover:bg-brand-500/10 dark:hover:bg-brand-500/20 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all backdrop-blur-sm border border-white/40 dark:border-slate-600/40"
                          >
                            <span>Details</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>

                      {/* Collapsible Contributing Details Table */}
                      {isExpanded && (
                        <tr className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm">
                          <td colSpan={4} className="p-4 border-t border-b border-slate-200/50 dark:border-slate-700/50">
                            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-inner">
                              <h5 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-widest">
                                Contributing Documents for: "{item.itemName}"
                              </h5>
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="border-b border-slate-200/60 dark:border-slate-700/60 font-bold text-slate-500">
                                    <th className="py-2">Document No</th>
                                    <th className="py-2">File Code</th>
                                    <th className="py-2">Document Type</th>
                                    <th className="py-2 text-right">Amount (TSH)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/60">
                                  {item.details.map((det, dIdx) => (
                                    <tr key={dIdx} className="hover:bg-white/40 dark:hover:bg-slate-800/30 transition-colors">
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
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Showing <strong className="text-slate-900 dark:text-white">{Math.min(visibleCount, summaryData?.items.length || 0)}</strong> of <strong className="text-slate-900 dark:text-white">{summaryData?.items.length}</strong> revenue line items
            </span>

            {(summaryData?.items.length || 0) > visibleCount && (
              <div className="flex gap-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 25)}
                  className="px-4 py-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all border border-white/20"
                >
                  Load More Rows (+25)
                </button>
                <button
                  onClick={() => setVisibleCount(summaryData?.items.length || 0)}
                  className="px-3 py-1.5 bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-600/80 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all backdrop-blur-sm border border-white/40 dark:border-slate-600/40"
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

