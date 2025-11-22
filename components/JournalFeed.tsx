import React from 'react';
import { JournalEntry } from '../types';
import { Calendar, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface JournalFeedProps {
  entries: JournalEntry[];
}

const JournalFeed: React.FC<JournalFeedProps> = ({ entries }) => {
  // Sort descending
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Your Journal</h2>
      
      {sortedEntries.map((entry) => (
        <div key={entry.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors">
          {/* Header */}
          <div className="bg-slate-800/30 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Calendar size={16} />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{entry.title || "Investment Update"}</h3>
            </div>
            <div className="flex gap-4">
               <div className="text-right">
                 <p className="text-xs text-slate-500">Total Assets</p>
                 <p className="text-lg font-bold text-slate-200">{formatCurrency(entry.stats.totalAssets)}</p>
               </div>
               <div className="text-right pl-4 border-l border-slate-700">
                 <p className="text-xs text-slate-500">Monthly P&L</p>
                 <p className={`text-lg font-bold flex items-center justify-end gap-1 ${entry.stats.totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                   {entry.stats.totalPnL >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                   {entry.stats.totalPnL > 0 ? '+' : ''}{formatCurrency(entry.stats.totalPnL)}
                 </p>
               </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6">
            
            {/* Image Gallery */}
            {entry.imageUrls && entry.imageUrls.length > 0 ? (
               <div className={`mb-8 grid gap-2 ${entry.imageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                 {entry.imageUrls.map((url, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                       <img src={url} alt={`Portfolio Snapshot ${idx+1}`} className="w-full max-h-64 object-contain mx-auto opacity-90 hover:opacity-100 transition-opacity" />
                    </div>
                 ))}
               </div>
            ) : entry.imageUrl ? (
                // Fallback for old entries
               <div className="mb-8 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                 <img src={entry.imageUrl} alt="Portfolio Snapshot" className="max-h-64 object-contain mx-auto opacity-90" />
               </div>
            ) : null}
            
            {/* Render Markdown */}
            <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-emerald-400 prose-a:text-blue-400">
               <ReactMarkdown>{entry.content}</ReactMarkdown>
            </div>
            
            {/* Action Plan Snippet */}
            {entry.actionPlan && entry.actionPlan.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-800">
                <h4 className="text-sm font-semibold text-slate-400 uppercase mb-4">Action Plan Recap</h4>
                <div className="space-y-2">
                  {entry.actionPlan.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                       <div className={`w-2 h-2 rounded-full ${item.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                       <span className="font-mono text-slate-500">{item.date}</span>
                       <span className="font-semibold text-slate-200 min-w-[60px]">{item.asset}</span>
                       <span className="text-slate-400 truncate">{item.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JournalFeed;