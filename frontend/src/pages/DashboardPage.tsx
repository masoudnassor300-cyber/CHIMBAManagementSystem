import React, { useEffect, useState } from 'react';
import { getDashboardStats, getClients, getFiles } from '../services/api';
import { DashboardStats, Client, CargoFile } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { Skeleton } from '../components/ui/Skeleton';
import { CreateClientModal } from '../components/clients/CreateClientModal';
import { CreateFileModal } from '../components/files/CreateFileModal';
import { CreateDocumentModal } from '../components/documents/CreateDocumentModal';
import { useTheme } from '../context/ThemeContext';
import { 
  Users, 
  FolderKanban, 
  FileText, 
  CreditCard, 
  Plus, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  Sparkles,
  Ship,
  Plane,
  Truck,
  ShieldCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const PIE_COLORS = ['#2563eb', '#dc2626', '#059669', '#d97706'];

export const DashboardPage: React.FC = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Theme Colors for Charts
  const gridStroke = theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
  const axisTextColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  // Modals state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [files, setFiles] = useState<CargoFile[]>([]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const openClientModal = async () => {
    setIsClientModalOpen(true);
  };

  const openFileModal = async () => {
    const fetchedClients = await getClients();
    setClients(fetchedClients);
    setIsFileModalOpen(true);
  };

  const openDocModal = async () => {
    const fetchedFiles = await getFiles();
    setFiles(fetchedFiles);
    setIsDocModalOpen(true);
  };

  const pieData = stats
    ? [
        { name: 'Tax Invoices (CLL)', value: stats.totalInvoices || 0 },
        { name: 'Debit Notes (DN)', value: stats.totalDebitNotes || 0 },
      ]
    : [];

  const totalBilled = (stats?.totalInvoices || 0) + (stats?.totalDebitNotes || 0);
  const unpaid = stats?.totalUnpaidBalance || 0;
  const collected = Math.max(0, totalBilled - unpaid);
  const collectionRate = totalBilled > 0 ? Math.round((collected / totalBilled) * 100) : 100;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Animated Hero Banner adapting to Light Mode & Dark Mode */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-700 via-indigo-700 to-blue-800 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-8 rounded-3xl text-white shadow-2xl border border-brand-600/30 dark:border-slate-800/80">
        {/* Animated Moving Background Graphics */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 dark:opacity-15 pointer-events-none overflow-hidden flex items-center justify-end pr-8">
          <div className="flex gap-6 animate-float">
            <Ship className="w-32 h-32 text-white/80 dark:text-brand-400" />
            <Plane className="w-28 h-28 text-white/80 dark:text-indigo-400" />
            <Truck className="w-32 h-32 text-white/80 dark:text-rose-400" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 dark:bg-brand-500/20 border border-white/20 dark:border-brand-500/30 rounded-full text-white dark:text-brand-300 font-semibold text-xs mb-3 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300 dark:text-amber-400 animate-spin" />
              <span>LIVE FREIGHT LOGISTICS DASHBOARD</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
              CHIMBA Logistics Control Center
            </h1>
            <p className="text-xs text-white/90 dark:text-slate-300 mt-2 leading-relaxed font-medium">
              Real-time sea port, airport, and road clearance tracking, invoice management, and collection analytics.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-white/20 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300 dark:text-emerald-400" />
                <span className="text-white/80 dark:text-slate-400">System Health: <strong className="text-white">Active 100%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-300 dark:text-brand-400" />
                <span className="text-white/80 dark:text-slate-400">Payment Collection Rate: <strong className="text-emerald-300 dark:text-emerald-400">{collectionRate}%</strong></span>
              </div>
            </div>
          </div>

          {/* Action Shortcuts */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={openClientModal}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2.5 border border-white/30 dark:border-white/20 backdrop-blur-md transition-all hover:scale-105 shadow-lg shadow-black/10"
            >
              <Plus className="w-4 h-4 text-white" /> Add New Client
            </button>
            <button
              onClick={openFileModal}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2.5 border border-white/30 dark:border-white/20 backdrop-blur-md transition-all hover:scale-105 shadow-lg shadow-black/10"
            >
              <Plus className="w-4 h-4 text-white" /> Open Job File
            </button>
            <button
              onClick={openDocModal}
              className="px-5 py-2.5 bg-white/90 hover:bg-white text-brand-700 dark:bg-gradient-to-r dark:from-brand-600 dark:to-indigo-600 dark:hover:from-brand-500 dark:hover:to-indigo-500 dark:text-white rounded-xl text-xs font-extrabold flex items-center gap-2.5 shadow-xl backdrop-blur-md transition-all hover:scale-105 border border-white/40"
            >
              <Plus className="w-4 h-4" /> Issue Invoice / Debit Note
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
        ) : (
          <>
            <StatCard
              title="Total Clients"
              value={stats?.totalClients || 0}
              icon={Users}
              colorScheme="blue"
              subtitle="Registered commercial clients"
            />
            <StatCard
              title="Total Job Files"
              value={stats?.totalFiles || 0}
              icon={FolderKanban}
              colorScheme="indigo"
              subtitle="Active clearance files"
            />
            <StatCard
              title="Total Invoices Value"
              value={`TSH ${(stats?.totalInvoices || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              icon={FileText}
              colorScheme="emerald"
              subtitle="Generated CLL Invoices"
            />
            <StatCard
              title="Total Debit Notes"
              value={`TSH ${(stats?.totalDebitNotes || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              icon={CreditCard}
              colorScheme="rose"
              subtitle="Generated Debit Notes"
            />
          </>
        )}
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Financial Trend Area Chart */}
        <div className="lg:col-span-2 backdrop-blur-md bg-white/10 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/50 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-500" /> Revenue & Billing Trends
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly invoice vs debit note financial progression (TSH)</p>
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-72 rounded-xl" />
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyTrends || []} margin={{ top: 15, right: 15, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInvoices" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorDebits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#dc2626" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisTextColor }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: axisTextColor }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border border-white/30 dark:border-slate-700/30 p-3 rounded-xl shadow-lg text-xs space-y-1.5">
                            <p className="font-extrabold text-slate-900 dark:text-white border-b border-slate-900/10 dark:border-white/10 pb-1 mb-1">{label}</p>
                            {payload.map((entry: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between gap-4 font-bold" style={{ color: entry.color }}>
                                <span>{entry.name}:</span>
                                <span className="font-mono">TSH {Number(entry.value).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="invoices"
                    name="Invoices"
                    stroke="#2563eb"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorInvoices)"
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff', fill: '#2563eb' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="debitNotes"
                    name="Debit Notes"
                    stroke="#dc2626"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorDebits)"
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff', fill: '#dc2626' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Revenue Ratio Breakdown Doughnut Chart */}
        <div className="backdrop-blur-md bg-white/10 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/50 rounded-2xl shadow-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" /> Revenue Ratio Share
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tax Invoices vs Debit Notes Distribution (TSH)</p>
          </div>

          {loading ? (
            <Skeleton className="h-56 rounded-xl" />
          ) : (
            <div className="h-56 w-full my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={6}
                    cornerRadius={6}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border border-white/30 dark:border-slate-700/30 p-3 rounded-xl shadow-lg text-xs font-bold text-slate-900 dark:text-white">
                            <p className="font-extrabold mb-1" style={{ color: data.payload.fill }}>{data.name}</p>
                            <p className="font-mono">TSH {Number(data.value).toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
          <span>Recent Operational Log</span>
          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
            Live System Feed
          </span>
        </h3>

        <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 my-2" />)
          ) : (
            stats?.recentActivities.map((act, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs hover:bg-white/40 dark:hover:bg-slate-800/40 px-3 rounded-xl transition-all duration-200 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-brand-600 to-indigo-600 text-white rounded-xl shadow-md shadow-brand-500/20">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{act.title}</span>
                    <span className="text-slate-500 dark:text-slate-400">{act.subtitle}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{act.timestamp ? act.timestamp.replace('T', ' ').substring(0, 16) : ''}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dynamic Modals */}
      <CreateClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSuccess={() => fetchDashboard()}
      />
      <CreateFileModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        clients={clients}
        onSuccess={() => fetchDashboard()}
      />
      <CreateDocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        files={files}
        onSuccess={() => fetchDashboard()}
      />
    </div>
  );
};
