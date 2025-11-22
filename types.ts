export interface AssetAllocation {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface ActionItem {
  date: string;
  asset: string;
  action: string;
  status: 'pending' | 'completed';
}

export interface PortfolioStats {
  totalAssets: number;
  totalPnL: number;
  pnlPercentage: number;
  assetBreakdown: AssetAllocation[];
}

export interface JournalEntry {
  id: string;
  date: string; // ISO Date string
  title: string;
  content: string; // Markdown content
  stats: PortfolioStats;
  actionPlan: ActionItem[];
  rawInput?: string;
  imageUrl?: string; // Kept for backward compatibility (first image)
  imageUrls?: string[]; // Support for multiple images
}

export interface AppState {
  entries: JournalEntry[];
  isLoading: boolean;
  error: string | null;
}

export const MOCK_INITIAL_DATA: JournalEntry = {
  id: 'initial-oct-2025',
  date: new Date('2025-10-01').toISOString(),
  title: 'Investment Growth Journal — October 2025',
  content: `## 📘 Investment Growth Journal — October 2025

**Goal**: Rp1 Billion Assets by 2029
**Profile**: Aggressive | High Risk | Growth-Focused | Crypto-Heavy

---

### 💼 Portfolio Summary

**Total Assets**: Rp87,688,133

* 📈 **Stocks (Ajaib)**: Rp73,075,632 (83.3%)
* 💵 **US Stock (Reku – SLV ETF)**: Rp14,612,501 (16.7%)
* ₿ **Crypto**: Rp0
* 💸 **Unrealized P&L (stocks)**: +Rp3,309,662 (+4.74%)

---

### 🧠 Reflection – October 2025

October marked a **steady rebound**. The portfolio gained ~4.7%, led by **PBSA and CUAN**, while ARCI slightly lagged. The addition of the **iShares Silver Trust (SLV)** in Reku diversified exposure into precious metals.`,
  stats: {
    totalAssets: 87688133,
    totalPnL: 3309662,
    pnlPercentage: 4.74,
    assetBreakdown: [
      { name: 'Stocks (Ajaib)', value: 73075632, percentage: 83.3, color: '#10b981' },
      { name: 'US Stocks', value: 14612501, percentage: 16.7, color: '#3b82f6' },
      { name: 'Crypto', value: 0, percentage: 0, color: '#f59e0b' }
    ]
  },
  actionPlan: [
    { date: 'Nov 1–5', asset: 'PBSA', action: 'Monitor; take partial profit if >+20% more', status: 'pending' },
    { date: 'Nov 10', asset: 'ARCI', action: 'Consider average-down if gold prices strengthen', status: 'pending' },
    { date: 'Nov 25', asset: 'BTC', action: 'Potential re-entry if <Rp1.2B/BTC', status: 'pending' }
  ]
};