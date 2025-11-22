import React from 'react';
import { LayoutDashboard, BookOpen, LineChart, Wallet, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'journal', icon: BookOpen, label: 'Journal' },
    { id: 'analysis', icon: LineChart, label: 'Analysis' },
    { id: 'assets', icon: Wallet, label: 'Assets' },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg shadow-lg shadow-emerald-900/50"></div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200 hidden lg:block">
          WealthAI
        </h1>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
              ${activeTab === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 shadow-inner shadow-emerald-500/5 border border-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
          >
            <item.icon size={22} className={`transition-colors ${activeTab === item.id ? 'text-emerald-400' : 'group-hover:text-white'}`} />
            <span className="font-medium hidden lg:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
          <Settings size={22} />
          <span className="font-medium hidden lg:block">Settings</span>
        </button>
        <div className="mt-4 px-3 py-2 bg-slate-800/50 rounded-lg hidden lg:block">
          <p className="text-xs text-slate-500">Goal: Rp1 Billion</p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '8.7%' }}></div>
          </div>
          <p className="text-right text-[10px] text-emerald-400 mt-1">8.7% Achieved</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;