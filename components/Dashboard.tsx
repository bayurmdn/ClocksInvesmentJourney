import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar, Target } from 'lucide-react';
import { JournalEntry } from '../types';

interface DashboardProps {
  entries: JournalEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  // Sort entries by date ascending for the chart
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const latestEntry = sortedEntries[sortedEntries.length - 1];
  
  // Format data for the Area Chart
  const chartData = sortedEntries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short' }),
    value: entry.stats.totalAssets
  }));

  // Data for Pie Chart
  const pieData = latestEntry?.stats.assetBreakdown || [];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Portfolio Overview</h2>
          <p className="text-slate-400 mt-1">Welcome back, Investor. Your journey to Rp1 Billion continues.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
          <Calendar size={16} className="text-slate-400" />
          <span className="text-sm text-slate-300">
            Last Update: {latestEntry ? new Date(latestEntry.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-emerald-500/20"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Net Assets</p>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mt-2">{latestEntry ? formatCurrency(latestEntry.stats.totalAssets) : 'Rp0'}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
              <WalletIcon />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center text-sm text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={14} className="mr-1" />
              4.74%
            </span>
            <span className="text-xs text-slate-500">vs last month</span>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/20"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Unrealized P&L</p>
              <h3 className={`text-2xl lg:text-3xl font-bold mt-2 ${latestEntry?.stats.totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {latestEntry ? (latestEntry.stats.totalPnL > 0 ? '+' : '') + formatCurrency(latestEntry.stats.totalPnL) : 'Rp0'}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-slate-500">Lifetime gain</span>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-amber-500/30 transition-all">
           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-amber-500/20"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Progress to Goal</p>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mt-2">8.7%</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
              <Target size={22} />
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full" style={{ width: '8.7%' }}></div>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex justify-between">
            <span>Current: 87M</span>
            <span>Target: 1B</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Cumulative Net Asset Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{fontSize: 12}} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#10b981' }}
                  formatter={(value: number) => [formatCurrency(value), "Total Assets"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorAssets)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation Chart */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Asset Allocation</h3>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#cbd5e1'} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                   formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-500 font-medium">ASSETS</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-200">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Plan - Extracted from latest entry */}
      {latestEntry && latestEntry.actionPlan && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
               <Target className="text-indigo-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Strategy & Action Plan</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {latestEntry.actionPlan.map((action, i) => (
               <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl hover:bg-slate-800 transition-colors">
                 <div className="flex justify-between mb-2">
                   <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded uppercase tracking-wide">{action.asset}</span>
                   <span className="text-xs text-slate-500">{action.date}</span>
                 </div>
                 <p className="text-sm text-slate-200 leading-relaxed">{action.action}</p>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Wallet Icon SVG
const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
);

export default Dashboard;