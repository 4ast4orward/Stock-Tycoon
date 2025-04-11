export interface Stock {
  symbol: string;
  name: string;
  price: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  beta: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  avgVolume: number;
  sector: string;
  industry: string;
  description: string;
  employees: number;
  website: string;
  headquarters: string;
  founded: string;
  ceo: string;
  ipoDate: string;
  // Optional properties that might not always be present
  logo?: string;
  currency?: string;
  exchange?: string;
  isin?: string;
  cusip?: string;
  lei?: string;
  primaryExchange?: string;
  type?: string;
  region?: string;
  timezone?: string;
  utcOffset?: string;
  lastUpdated?: string;
}

export interface StockHolding {
  name: string;
  symbol: string;
  price: number;
  shares: number;
  purchasePrice: number;
  sector?: string;
  purchaseDate: string;
}

export interface Portfolio {
  [key: string]: StockHolding;
}

export interface FilterOptions {
  sectors: string[];
  priceRanges: { min: number; max: number }[];
  showOnlyPortfolioStocks: boolean;
}

export type SortOption = 
  | 'nameAsc' 
  | 'nameDesc' 
  | 'priceAsc' 
  | 'priceDesc' 
  | 'performanceAsc' 
  | 'performanceDesc';

export interface StockFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (sortOption: SortOption, filters: FilterOptions) => void;
  currentSortOption?: SortOption;
  currentFilters?: FilterOptions;
}

export interface PortfolioSummaryProps {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
}

export interface NetWorthDisplayProps {
  cash: number;
  portfolioValue: number;
  income: number;
  expenses: number;
  history?: { date: string; netWorth: number }[];
  netWorth: number;
  dailyChange: number;
  dailyChangePercent: number;
}

export interface StockDetailsProps {
  isVisible: boolean;
  stock: Stock | null;
  onClose: () => void;
  onBuy: () => void;
  historicalData?: { date: string; price: number }[];
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  url: string;
  imageUrl: string;
  summary: string;
  relatedTickers: string[];
}

export interface NewsFeedProps {
  news: NewsItem[];
  isLoading: boolean;
  onRefresh: () => void;
  filterByTicker?: string;
}

export interface TutorialProps {
  visible: boolean;
  onClose: () => void;
} 