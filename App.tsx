import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import JournalInput from './components/JournalInput';
import JournalFeed from './components/JournalFeed';
import { JournalEntry, MOCK_INITIAL_DATA } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('wealth_architect_entries');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error("Failed to parse saved entries", e);
        setEntries([MOCK_INITIAL_DATA]);
      }
    } else {
      setEntries([MOCK_INITIAL_DATA]);
    }
    setIsFirstLoad(false);
  }, []);

  // Save to local storage whenever entries change
  useEffect(() => {
    if (!isFirstLoad) {
      localStorage.setItem('wealth_architect_entries', JSON.stringify(entries));
    }
  }, [entries, isFirstLoad]);

  const handleNewEntry = (entry: JournalEntry) => {
    setEntries(prev => [...prev, entry]);
    setActiveTab('dashboard'); // Redirect to dashboard to see update
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto h-screen relative">
        {/* Header gradient background */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          {activeTab === 'dashboard' && (
            <Dashboard entries={entries} />
          )}

          {activeTab === 'journal' && (
            <div className="p-6 lg:p-10 space-y-10 min-h-screen">
               <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold text-white mb-2">Journaling</h2>
                  <p className="text-slate-400">Record your moves, analyze your positions, and let AI sharpen your strategy.</p>
               </div>
              <JournalInput onNewEntry={handleNewEntry} />
              <div className="border-t border-slate-800 pt-10">
                <JournalFeed entries={entries} />
              </div>
            </div>
          )}

          {(activeTab === 'analysis' || activeTab === 'assets') && (
             <div className="flex items-center justify-center h-[80vh] flex-col gap-4 text-slate-500">
               <div className="w-16 h-16 border-2 border-slate-800 border-dashed rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚧</span>
               </div>
               <p>This feature is coming in the next update.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;