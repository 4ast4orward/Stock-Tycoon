import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Text, View, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, Alert, ScrollView, Platform, LogBox, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
// If background image is missing, comment it out or provide the correct path
// import backgroundImage from './assets/background.jpg';
import { fetchStockPrice, fetchStockPriceAlternative, getSimulatedPrice } from './src/api/stockApi';
import { fetchYahooStockPrice } from './src/api/yahooFinanceApi';
import { fetchFinnhubStockPrice } from './src/api/finnhubApi';
import { fetchIEXStockPrice } from './src/api/iexCloudApi';
import { fetchMarketDataPrice, fetchMarketDataPriceAlternative, fetchCostcoPrice } from './src/api/marketDataApi';
import { scrapeCNBCStockPrice, scrapeMarketWatchStockPrice, scrapeCostcoPrice, extractYahooFinancePrice, fetchCostcoDirectAPI } from './src/api/webScraperApi';
import { fetchYahooDirectPrice, fetchYahooBackupPrice, fetchCostcoDirectPrice, fetchBatchPrices } from './src/api/directStockApi';
import { getHardcodedPrice, getHardcodedPrices } from './src/api/hardcodedPrices';
import { getConfig } from './src/config/apiConfig';
import { 
  StockDetails, 
  PortfolioManager, 
  MarketIndices, 
  StockFilters, 
  NetWorthDisplay, 
  NewsFeed, 
  StockPerformanceIndicator, 
  Tutorial,
  Settings,
  Challenges,
  AnimatedValue,
  Background,
  StockCard,
  MarketIndex,
  PortfolioSummary
} from './src/components';
import { Ionicons } from '@expo/vector-icons';

// Suppress specific warnings if they're coming from third-party libraries
LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'setNativeProps is deprecated'
]);

// Define types for our data structures
interface Stock {
  id: string;
  name: string;
  symbol: string;
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
}

interface Company extends Stock {
  id: string;
}

interface StockHolding {
  name: string;
  symbol: string;
  price: number;
  shares: number;
  purchasePrice: number;
  sector: string;
  purchaseDate: string;
}

interface Portfolio {
  [key: string]: StockHolding;
}

// Sample list of major companies with verified ticker symbols
const companyList = [
  { name: '3M', symbol: 'MMM' },
  { name: 'AbbVie', symbol: 'ABBV' },
  { name: 'Abbott', symbol: 'ABT' },
  { name: 'Adobe', symbol: 'ADBE' },
  { name: 'Aflac', symbol: 'AFL' },
  { name: 'Allstate', symbol: 'ALL' },
  { name: 'Alphabet (Google)', symbol: 'GOOGL' },
  { name: 'Altria', symbol: 'MO' },
  { name: 'Amazon', symbol: 'AMZN' },
  { name: 'American Express', symbol: 'AXP' },
  { name: 'American Tower', symbol: 'AMT' },
  { name: 'Amgen', symbol: 'AMGN' },
  { name: 'Anthem', symbol: 'ANTM' },
  { name: 'Aon', symbol: 'AON' },
  { name: 'Apple', symbol: 'AAPL' },
  { name: 'Arthur J. Gallagher', symbol: 'AJG' },
  { name: 'AstraZeneca', symbol: 'AZN' },
  { name: 'AT&T', symbol: 'T' },
  { name: 'Bank of America', symbol: 'BAC' },
  { name: 'Becton Dickinson', symbol: 'BDX' },
  { name: 'Berkshire Hathaway', symbol: 'BRK.B' },
  { name: 'BlackRock', symbol: 'BLK' },
  { name: 'Boeing', symbol: 'BA' },
  { name: 'Bristol-Myers Squibb', symbol: 'BMY' },
  { name: 'Broadcom', symbol: 'AVGO' },
  { name: 'Caterpillar', symbol: 'CAT' },
  { name: 'Chevron', symbol: 'CVX' },
  { name: 'Cigna', symbol: 'CI' },
  { name: 'Cisco', symbol: 'CSCO' },
  { name: 'Citigroup', symbol: 'C' },
  { name: 'CME Group', symbol: 'CME' },
  { name: 'Coca-Cola', symbol: 'KO' },
  { name: 'Cognizant', symbol: 'CTSH' },
  { name: 'Colgate-Palmolive', symbol: 'CL' },
  { name: 'Comcast', symbol: 'CMCSA' },
  { name: 'ConocoPhillips', symbol: 'COP' },
  { name: 'Costco', symbol: 'COST' },
  { name: 'CVS Health', symbol: 'CVS' },
  { name: 'Danaher', symbol: 'DHR' },
  { name: 'Disney', symbol: 'DIS' },
  { name: 'Dominion Energy', symbol: 'D' },
  { name: 'Dover', symbol: 'DOV' },
  { name: 'Duke Energy', symbol: 'DUK' },
  { name: 'Eaton', symbol: 'ETN' },
  { name: 'Ecolab', symbol: 'ECL' },
  { name: 'Eli Lilly', symbol: 'LLY' },
  { name: 'Emerson Electric', symbol: 'EMR' },
  { name: 'Equinix', symbol: 'EQIX' },
  { name: 'Equity Residential', symbol: 'EQR' },
  { name: 'Estee Lauder', symbol: 'EL' },
  { name: 'Exelon', symbol: 'EXC' },
  { name: 'ExxonMobil', symbol: 'XOM' },
  { name: 'Fidelity National', symbol: 'FIS' },
  { name: 'First Republic Bank', symbol: 'FRC' },
  { name: 'FMC', symbol: 'FMC' },
  { name: 'Ford', symbol: 'F' },
  { name: 'Freeport-McMoRan', symbol: 'FCX' },
  { name: 'General Electric', symbol: 'GE' },
  { name: 'General Motors', symbol: 'GM' },
  { name: 'Gilead Sciences', symbol: 'GILD' },
  { name: 'Goldman Sachs', symbol: 'GS' },
  { name: 'Hartford Financial', symbol: 'HIG' },
  { name: 'HCA Healthcare', symbol: 'HCA' },
  { name: 'Hershey', symbol: 'HSY' },
  { name: 'Hewlett Packard', symbol: 'HPQ' },
  { name: 'Hilton Worldwide', symbol: 'HLT' },
  { name: 'Home Depot', symbol: 'HD' },
  { name: 'Honeywell', symbol: 'HON' },
  { name: 'Humana', symbol: 'HUM' },
  { name: 'IBM', symbol: 'IBM' },
  { name: 'Intercontinental Exchange', symbol: 'ICE' },
  { name: 'Intel', symbol: 'INTC' },
  { name: 'Intuit', symbol: 'INTU' },
  { name: 'Johnson & Johnson', symbol: 'JNJ' },
  { name: 'Johnson Controls', symbol: 'JCI' },
  { name: 'JPMorgan Chase', symbol: 'JPM' },
  { name: 'Kellogg', symbol: 'K' },
  { name: 'Kimberly-Clark', symbol: 'KMB' },
  { name: 'Kraft Heinz', symbol: 'KHC' },
  { name: 'Kroger', symbol: 'KR' },
  { name: 'L3Harris Technologies', symbol: 'LHX' },
  { name: 'Las Vegas Sands', symbol: 'LVS' },
  { name: 'Lennar', symbol: 'LEN' },
  { name: 'Lockheed Martin', symbol: 'LMT' },
  { name: 'Lowe\'s', symbol: 'LOW' },
  { name: 'Marathon Petroleum', symbol: 'MPC' },
  { name: 'Marriott International', symbol: 'MAR' },
  { name: 'Marsh & McLennan', symbol: 'MMC' },
  { name: 'Mastercard', symbol: 'MA' },
  { name: 'McDonald\'s', symbol: 'MCD' },
  { name: 'McKesson', symbol: 'MCK' },
  { name: 'Medtronic', symbol: 'MDT' },
  { name: 'Merck', symbol: 'MRK' },
  { name: 'Meta Platforms', symbol: 'META' },
  { name: 'MetLife', symbol: 'MET' },
  { name: 'Microsoft', symbol: 'MSFT' },
  { name: 'Mondelez', symbol: 'MDLZ' },
  { name: 'Moody\'s', symbol: 'MCO' },
  { name: 'Morgan Stanley', symbol: 'MS' },
  { name: 'Motorola Solutions', symbol: 'MSI' },
  { name: 'Nasdaq', symbol: 'NDAQ' },
  { name: 'Netflix', symbol: 'NFLX' },
  { name: 'NextEra Energy', symbol: 'NEE' },
  { name: 'Nike', symbol: 'NKE' },
  { name: 'Norfolk Southern', symbol: 'NSC' },
  { name: 'Northern Trust', symbol: 'NTRS' },
  { name: 'Northrop Grumman', symbol: 'NOC' },
  { name: 'Nucor', symbol: 'NUE' },
  { name: 'NVIDIA', symbol: 'NVDA' },
  { name: 'Omnicom', symbol: 'OMC' },
  { name: 'Oracle', symbol: 'ORCL' },
  { name: 'Parker-Hannifin', symbol: 'PH' },
  { name: 'PayPal', symbol: 'PYPL' },
  { name: 'PepsiCo', symbol: 'PEP' },
  { name: 'Pfizer', symbol: 'PFE' },
  { name: 'Philip Morris', symbol: 'PM' },
  { name: 'Procter & Gamble', symbol: 'PG' },
  { name: 'Progressive', symbol: 'PGR' },
  { name: 'Prologis', symbol: 'PLD' },
  { name: 'Prudential', symbol: 'PRU' },
  { name: 'Public Storage', symbol: 'PSA' },
  { name: 'Qualcomm', symbol: 'QCOM' },
  { name: 'Raytheon Technologies', symbol: 'RTX' },
  { name: 'Republic Services', symbol: 'RSG' },
  { name: 'Rockwell Automation', symbol: 'ROK' },
  { name: 'S&P Global', symbol: 'SPGI' },
  { name: 'Salesforce', symbol: 'CRM' },
  { name: 'Schlumberger', symbol: 'SLB' },
  { name: 'Sempra Energy', symbol: 'SRE' },
  { name: 'Sherwin-Williams', symbol: 'SHW' },
  { name: 'Simon Property', symbol: 'SPG' },
  { name: 'Southern Company', symbol: 'SO' },
  { name: 'Stanley Black & Decker', symbol: 'SWK' },
  { name: 'Starbucks', symbol: 'SBUX' },
  { name: 'State Street', symbol: 'STT' },
  { name: 'SunTrust Banks', symbol: 'STI' },
  { name: 'Sysco', symbol: 'SYY' },
  { name: 'T-Mobile', symbol: 'TMUS' },
  { name: 'T. Rowe Price', symbol: 'TROW' },
  { name: 'Target', symbol: 'TGT' },
  { name: 'Tesla', symbol: 'TSLA' },
  { name: 'Texas Instruments', symbol: 'TXN' },
  { name: 'Thermo Fisher', symbol: 'TMO' },
  { name: 'Travelers', symbol: 'TRV' },
  { name: 'Truist Financial', symbol: 'TFC' },
  { name: 'Tyson Foods', symbol: 'TSN' },
  { name: 'U.S. Bancorp', symbol: 'USB' },
  { name: 'Union Pacific', symbol: 'UNP' },
  { name: 'UnitedHealth', symbol: 'UNH' },
  { name: 'UPS', symbol: 'UPS' },
  { name: 'Valero Energy', symbol: 'VLO' },
  { name: 'Verizon', symbol: 'VZ' },
  { name: 'Visa', symbol: 'V' },
  { name: 'Vulcan Materials', symbol: 'VMC' },
  { name: 'Walgreens Boots Alliance', symbol: 'WBA' },
  { name: 'Walmart', symbol: 'WMT' },
  { name: 'Waste Management', symbol: 'WM' },
  { name: 'WEC Energy Group', symbol: 'WEC' },
  { name: 'Wells Fargo', symbol: 'WFC' },
  { name: 'WestRock', symbol: 'WRK' },
  { name: 'Williams Companies', symbol: 'WMB' },
  { name: 'Willis Towers Watson', symbol: 'WLTW' },
  { name: 'Xerox', symbol: 'XRX' },
  { name: 'Xcel Energy', symbol: 'XEL' },
  { name: 'Yum! Brands', symbol: 'YUM' },
  { name: 'Zimmer Biomet', symbol: 'ZBH' },
  { name: 'Zions Bancorporation', symbol: 'ZION' },
  { name: 'Zoetis', symbol: 'ZTS' }
];

const mockCompanies = [
  {
    name: 'Apple Inc.',
    symbol: 'AAPL',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.'
  },
  {
    name: 'Microsoft Corporation',
    symbol: 'MSFT',
    sector: 'Technology',
    industry: 'Software',
    description: 'Microsoft Corporation develops, licenses, and supports computer software, consumer electronics, personal computers, and related services.'
  },
  {
    name: 'Amazon.com Inc.',
    symbol: 'AMZN',
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    description: 'Amazon.com Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.'
  },
  {
    name: 'Alphabet Inc.',
    symbol: 'GOOGL',
    sector: 'Technology',
    industry: 'Internet Content & Information',
    description: 'Alphabet Inc. provides various products and platforms for search, advertising, commerce, and cloud computing.'
  },
  {
    name: 'Meta Platforms Inc.',
    symbol: 'META',
    sector: 'Technology',
    industry: 'Internet Content & Information',
    description: 'Meta Platforms Inc. develops products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and in-home devices.'
  }
];

const generateMockCompanies = (count: number): Company[] => {
  return mockCompanies.slice(0, count).map(company => {
    const founded = String(Math.floor(Math.random() * 100) + 1900);
    return {
      id: company.symbol,
      ...company,
      price: Math.random() * 1000 + 50,
      previousPrice: Math.random() * 1000 + 50,
      change: Math.random() * 20 - 10,
      changePercent: Math.random() * 4 - 2,
      volume: Math.floor(Math.random() * 10000000),
      marketCap: Math.random() * 1000000000000,
      peRatio: Math.random() * 30 + 10,
      dividendYield: Math.random() * 5,
      beta: Math.random() * 2,
      fiftyTwoWeekHigh: Math.random() * 1200 + 100,
      fiftyTwoWeekLow: Math.random() * 800 + 50,
      avgVolume: Math.floor(Math.random() * 5000000),
      sector: company.sector || 'Technology',
      industry: company.industry || 'Software',
      description: company.description || 'A leading technology company.',
      employees: Math.floor(Math.random() * 100000) + 1000,
      website: `https://www.${company.symbol.toLowerCase()}.com`,
      headquarters: 'United States',
      founded,
      ceo: 'CEO Name',
      ipoDate: '2000-01-01'
    };
  });
};

const initialCompanies = generateMockCompanies(50);

const screenWidth = Dimensions.get('window').width;

const isIOS = Platform.OS === 'ios';

const App = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [cash, setCash] = useState(100000);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [netWorth, setNetWorth] = useState(100000);
  const [dailyChange, setDailyChange] = useState(0);
  const [dailyChangePercent, setDailyChangePercent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Company | null>(null);
  const [showStockDetails, setShowStockDetails] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [newsItems, setNewsItems] = useState([
    {
      id: '1',
      title: 'Market Overview: Major Indices Update',
      date: new Date().toISOString(),
      url: 'https://example.com/news/market-overview',
      imageUrl: 'https://via.placeholder.com/300x200',
      summary: 'Latest updates on major market indices and sector performance.',
      relatedTickers: ['SPY', 'QQQ', 'DIA']
    },
    {
      id: '2',
      title: 'Tech Sector Analysis',
      date: new Date().toISOString(),
      url: 'https://example.com/news/tech-analysis',
      imageUrl: 'https://via.placeholder.com/300x200',
      summary: 'In-depth analysis of the technology sector performance and future outlook.',
      relatedTickers: ['AAPL', 'MSFT', 'GOOGL']
    },
    {
      id: '3',
      title: 'Economic Indicators Report',
      date: new Date().toISOString(),
      url: 'https://example.com/news/economic-report',
      imageUrl: 'https://via.placeholder.com/300x200',
      summary: 'Key economic indicators and their impact on market sentiment.',
      relatedTickers: ['SPY', 'QQQ']
    }
  ]);
  const [marketIndices, setMarketIndices] = useState([
    { name: 'S&P 500', value: 4185.82, change: 12.45, changePercent: 0.30 },
    { name: 'Dow Jones', value: 33875.40, change: 22.34, changePercent: 0.07 },
    { name: 'NASDAQ', value: 12123.47, change: -35.93, changePercent: -0.29 },
    { name: 'Russell 2000', value: 1892.55, change: 3.73, changePercent: 0.20 }
  ]);
  const [showChallenges, setShowChallenges] = useState(false);

  useEffect(() => {
    // Initialize companies
    const initialCompanies = generateMockCompanies(50);
    setCompanies(initialCompanies);
  }, []);

  useEffect(() => {
    // Update portfolio value
    const totalValue = Object.entries(portfolio).reduce((sum, [symbol, shares]) => {
      const company = companies.find(c => c.symbol === symbol);
      return sum + (company ? Number(company.price) * Number(shares) : 0);
    }, 0);

    const change = Number(totalValue) - Number(netWorth);
    const changePercent = (change / Number(netWorth)) * 100;

    setNetWorth(totalValue);
    setDailyChange(change);
    setDailyChangePercent(changePercent);
  }, [portfolio, companies]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleBuyStock = (symbol: string) => {
    const stock = companies.find(c => c.symbol === symbol);
    if (!stock) return;

    setPortfolio(prev => ({
      ...prev,
      [stock.symbol]: {
        name: stock.name,
        symbol: stock.symbol,
        price: stock.price,
        shares: (prev[stock.symbol]?.shares || 0) + 1,
        purchasePrice: stock.price,
        sector: stock.sector,
        purchaseDate: new Date().toISOString()
      }
    }));
  };

  const handleSellStock = (symbol: string) => {
    const stock = companies.find(c => c.symbol === symbol);
    if (!stock) return;

    setPortfolio(prev => {
      const currentShares = prev[stock.symbol]?.shares || 0;
      if (currentShares <= 1) {
        const { [stock.symbol]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [stock.symbol]: {
          ...prev[stock.symbol],
          shares: currentShares - 1
        }
      };
    });
  };

  const updatePortfolioValue = (updatedCompanies: Company[]) => {
    // If portfolio is empty, nothing to update
    if (Object.keys(portfolio).length === 0) return;
    
    // Create a map of symbol to price for quick lookup
    const priceMap: {[symbol: string]: number} = {};
    updatedCompanies.forEach(company => {
      priceMap[company.symbol] = company.price;
    });
    
    // Update each stock in the portfolio with its current price
    setPortfolio(prevPortfolio => {
      const updatedPortfolio = {...prevPortfolio};
      
      for (const symbol in updatedPortfolio) {
        const currentPrice = priceMap[symbol];
        if (currentPrice !== undefined) {
          updatedPortfolio[symbol] = {
            ...updatedPortfolio[symbol],
            price: currentPrice
          };
        }
      }
      
      return updatedPortfolio;
    });
  };

  const saveGameState = async () => {
    try {
      const gameState = { 
        cash, 
        income, 
        expenses, 
        portfolio
      };
      await AsyncStorage.setItem('gameState', JSON.stringify(gameState));
      alert('Game saved successfully!');
    } catch (error) {
      console.log('Error saving game state:', error);
      alert('Failed to save game');
    }
  };

  const loadGameState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('gameState');
      if (savedState) {
        const gameState = JSON.parse(savedState);
        setCash(gameState.cash);
        setIncome(gameState.income);
        setExpenses(gameState.expenses);
        
        // Load portfolio if it exists in saved data
        if (gameState.portfolio) {
          setPortfolio(gameState.portfolio);
        }
        
        alert('Game loaded successfully!');
      }
    } catch (error) {
      console.log('Error loading game state:', error);
      alert('Failed to load game');
    }
  };

  // Function to simulate price changes
  const simulatePriceChanges = () => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) => {
        const previousPrice = company.price;
        const newPrice = getSimulatedPrice(company.symbol, previousPrice);
        return {
          ...company,
          price: newPrice,
          previousPrice: previousPrice
        };
      })
    );
  };

  // Function to fetch real stock prices
  const fetchRealStockPrices = async () => {
    // Check if real data feature is enabled
    const useRealData = getConfig('FEATURES.USE_REAL_DATA') as boolean;
    if (!useRealData) {
      console.log('Real stock data feature is disabled in config');
      return;
    }

    try {
      console.log('Starting to fetch real stock prices...');
      setIsLoading(true);
      
      // Get number of companies to fetch from config
      const companiesToFetchCount = getConfig('FEATURES.COMPANIES_TO_FETCH') as number;
      let companiesToUpdate = companies.slice(0, companiesToFetchCount);
      
      console.log(`Will fetch data for ${companiesToFetchCount} companies:`, 
        companiesToUpdate.map(c => `${c.name} (${c.symbol})`).join(', '));
      
      // Create a copy of the current companies to update
      let updatedCompanies = [...companies];
      let updatedCount = 0;
      
      // Check if hardcoded prices are enabled
      const useHardcodedPrices = getConfig('HARDCODED_PRICES.ENABLED') as boolean;
      const useExclusively = getConfig('HARDCODED_PRICES.USE_EXCLUSIVELY') as boolean;
      const overrideAllApis = getConfig('HARDCODED_PRICES.OVERRIDE_ALL_APIS') as boolean;
      const forceCostcoHardcoded = getConfig('FEATURES.FORCE_HARDCODED_COSTCO') as boolean;
      
      // Apply hardcoded prices first if enabled
      if (useHardcodedPrices) {
        console.log('Applying hardcoded prices first...');
        
        // Get symbols for all companies to update
        const symbols = companiesToUpdate.map(c => c.symbol);
        
        // Get hardcoded prices for all symbols
        const hardcodedPricesMap = getHardcodedPrices(symbols);
        const hardcodedCount = Object.keys(hardcodedPricesMap).length;
        
        console.log(`Found hardcoded prices for ${hardcodedCount} out of ${symbols.length} companies`);
        
        // Special handling for Costco to always use hardcoded price if available
        if (forceCostcoHardcoded) {
          const costcoHardcodedPrice = getHardcodedPrice('COST');
          if (costcoHardcodedPrice !== null) {
            console.log(`Forcing hardcoded price for Costco: $${costcoHardcodedPrice}`);
            
            // Update Costco in our companies list
            updatedCompanies = updatedCompanies.map(company => {
              if (company.symbol === 'COST') {
                console.log(`Updating Costco price from $${company.price.toFixed(2)} to $${costcoHardcodedPrice.toFixed(2)} (hardcoded)`);
                return {
                  ...company,
                  price: costcoHardcodedPrice
                };
              }
              return company;
            });
            
            // Also update in portfolio if owned
            if (portfolio['COST']) {
              setPortfolio(prevPortfolio => ({
                ...prevPortfolio,
                COST: {
                  ...prevPortfolio.COST,
                  price: costcoHardcodedPrice
                }
              }));
            }
            
            updatedCount++;
          }
        }
        
        // Apply all other hardcoded prices
        if (hardcodedCount > 0) {
          // Update companies with hardcoded prices
          updatedCompanies = updatedCompanies.map(company => {
            // Skip Costco if we already handled it specially
            if (forceCostcoHardcoded && company.symbol === 'COST') {
              return company;
            }
            
            const hardcodedPrice = hardcodedPricesMap[company.symbol];
            if (hardcodedPrice !== undefined) {
              console.log(`Using hardcoded price for ${company.name} (${company.symbol}): $${hardcodedPrice}`);
              return {
                ...company,
                price: hardcodedPrice
              };
            }
            return company;
          });
          
          // Update portfolio with hardcoded prices
          for (const symbol in hardcodedPricesMap) {
            // Skip Costco if we already handled it specially
            if (forceCostcoHardcoded && symbol === 'COST') {
              continue;
            }
            
            if (portfolio[symbol]) {
              setPortfolio(prevPortfolio => ({
                ...prevPortfolio,
                [symbol]: {
                  ...prevPortfolio[symbol],
                  price: hardcodedPricesMap[symbol]
                }
              }));
            }
          }
          
          // Count the number of prices we updated
          const nonCostcoHardcodedCount = forceCostcoHardcoded ? 
            (hardcodedCount - (hardcodedPricesMap['COST'] !== undefined ? 1 : 0)) : 
            hardcodedCount;
          
          updatedCount += nonCostcoHardcodedCount;
          
          // If we're using hardcoded prices exclusively, skip API calls for stocks with hardcoded prices
          if (useExclusively) {
            companiesToUpdate = companiesToUpdate.filter(company => {
              const hasHardcodedPrice = hardcodedPricesMap[company.symbol] !== undefined;
              return !hasHardcodedPrice;
            });
            
            console.log(`After applying hardcoded prices, need to fetch ${companiesToUpdate.length} more companies`);
            
            if (companiesToUpdate.length === 0) {
              console.log('No more companies to fetch after applying hardcoded prices');
              setCompanies(updatedCompanies);
              updatePortfolioValue(updatedCompanies);
              
              Alert.alert(
                "Success",
                "Successfully updated all stock prices with verified data.",
                [{ text: "OK" }]
              );
              
              setIsLoading(false);
              return;
            }
          }
        }
      }
      
      // Get API priority from config for remaining companies
      const apiPriority = getConfig('API_PRIORITY') as string[];
      
      // Skip API calls if all companies already have hardcoded prices
      if (companiesToUpdate.length === 0) {
        setCompanies(updatedCompanies);
        updatePortfolioValue(updatedCompanies);
        console.log('Using exclusively hardcoded prices for all companies');
        Alert.alert(
          "Success",
          "Successfully updated all stock prices with verified data.",
          [{ text: "OK" }]
        );
        setIsLoading(false);
        return;
      }
      
      // Continue with API fetching for companies without hardcoded prices
      console.log(`Using APIs to fetch prices for ${companiesToUpdate.length} remaining companies`);
      
      // Check if batch fetching is enabled
      const useBatchFetching = getConfig('FEATURES.USE_BATCH_FETCHING') as boolean;
      
      if (useBatchFetching && apiPriority.includes('DIRECT_STOCK')) {
        console.log('Using batch fetching for efficiency...');
        
        // Special handling for Costco first if we don't have a hardcoded price or aren't forcing it
        let costcoCompany = companiesToUpdate.find(c => c.symbol === 'COST');
        
        if (costcoCompany && (!useHardcodedPrices || !forceCostcoHardcoded || !getHardcodedPrice('COST'))) {
          console.log('Fetching Costco price using specialized method...');
          const costcoPrice = await fetchCostcoDirectPrice();
          
          if (costcoPrice !== null) {
            console.log(`Successfully fetched Costco price: $${costcoPrice}`);
            
            // Update Costco in our copy
            updatedCompanies = updatedCompanies.map(c => 
              c.symbol === 'COST' ? { ...c, price: costcoPrice } : c
            );
            
            // Also update the price in the portfolio if the user owns this stock
            if (portfolio['COST']) {
              setPortfolio(prevPortfolio => ({
                ...prevPortfolio,
                COST: {
                  ...prevPortfolio.COST,
                  price: costcoPrice
                }
              }));
            }
            
            updatedCount++;
            
            // Remove Costco from companies to update
            companiesToUpdate = companiesToUpdate.filter(c => c.symbol !== 'COST');
          }
        }
        
        // Get symbols for all other companies
        const symbols = companiesToUpdate.map(c => c.symbol);
        
        if (symbols.length > 0) {
          // Split symbols into batches
          const batchSize = getConfig('DIRECT_STOCK.BATCH_SIZE') as number;
          const batches = [];
          
          for (let i = 0; i < symbols.length; i += batchSize) {
            batches.push(symbols.slice(i, i + batchSize));
          }
          
          console.log(`Split ${symbols.length} symbols into ${batches.length} batches of up to ${batchSize} each`);
          
          // Process each batch
          for (const batch of batches) {
            console.log(`Processing batch of ${batch.length} symbols: ${batch.join(', ')}`);
            
            const batchResults = await fetchBatchPrices(batch);
            const batchCount = Object.keys(batchResults).length;
            
            console.log(`Received ${batchCount} prices from batch request`);
            
            // Update companies with batch results
            for (const symbol in batchResults) {
              const price = batchResults[symbol];
              
              // Find the company with this symbol
              const company = companiesToUpdate.find(c => c.symbol === symbol);
              
              if (company) {
                // Skip if we should override with hardcoded price
                const hardcodedPrice = getHardcodedPrice(symbol);
                if (overrideAllApis && hardcodedPrice !== null) {
                  console.log(`Skipping API price for ${symbol} in favor of hardcoded price: $${hardcodedPrice}`);
                  continue;
                }
                
                console.log(`Updating ${company.name} (${symbol}) price from $${company.price.toFixed(2)} to $${price.toFixed(2)}`);
                
                // Update the company in our copy
                updatedCompanies = updatedCompanies.map(c => 
                  c.symbol === symbol ? { ...c, price: price } : c
                );
                
                // Also update the price in the portfolio if the user owns this stock
                if (portfolio[symbol]) {
                  setPortfolio(prevPortfolio => ({
                    ...prevPortfolio,
                    [symbol]: {
                      ...prevPortfolio[symbol],
                      price: price
                    }
                  }));
                }
                
                updatedCount++;
              }
            }
            
            // Add delay between batches
            if (batches.indexOf(batch) < batches.length - 1) {
              const delay = getConfig('DIRECT_STOCK.DELAY_BETWEEN_CALLS_MS') as number;
              console.log(`Waiting ${delay}ms before next batch...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        }
      } else {
        // Individual fetching (original method)
        for (const company of companiesToUpdate) {
          // Skip if we're using hardcoded prices exclusively and this company has one
          const hardcodedPrice = getHardcodedPrice(company.symbol);
          if (useHardcodedPrices && useExclusively && hardcodedPrice !== null) {
            console.log(`Skipping API fetch for ${company.symbol} as we're using its hardcoded price`);
            continue;
          }
          
          // Special handling for Costco with forced hardcoded price
          if (company.symbol === 'COST' && forceCostcoHardcoded && hardcodedPrice !== null) {
            console.log(`Skipping API fetch for Costco as we're using its hardcoded price`);
            continue;
          }
          
          console.log(`Fetching real price for ${company.name} (${company.symbol})...`);
          
          let price: number | null = null;
          
          // Special handling for Costco
          if (company.symbol === 'COST') {
            // Try the direct API first (most reliable)
            price = await fetchCostcoDirectPrice();
            
            // If that fails, try the other direct API
            if (price === null) {
              price = await fetchCostcoDirectAPI();
            }
            
            // If that fails, try the specialized Costco scraper
            if (price === null) {
              price = await scrapeCostcoPrice();
            }
            
            // If that fails, try the specialized Costco API
            if (price === null) {
              price = await fetchCostcoPrice();
            }
          }
          
          // If Costco special handling failed or it's not Costco, try regular APIs
          if (price === null) {
            // Try APIs in priority order
            for (const api of apiPriority) {
              if (price !== null) break; // Skip if we already have a price
              
              // Skip hardcoded prices as we've already handled them
              if (api === 'HARDCODED_PRICES') continue;
              
              console.log(`Trying ${api} API for ${company.symbol}...`);
              
              switch (api) {
                case 'DIRECT_STOCK':
                  if (getConfig('DIRECT_STOCK.ENABLED') as boolean) {
                    // Try direct Yahoo Finance API
                    price = await fetchYahooDirectPrice(company.symbol);
                    
                    if (price === null) {
                      price = await fetchYahooBackupPrice(company.symbol);
                    }
                    
                    if (price !== null) {
                      await new Promise(resolve => setTimeout(resolve, getConfig('DIRECT_STOCK.DELAY_BETWEEN_CALLS_MS') as number));
                    }
                  }
                  break;
                case 'WEB_SCRAPER':
                  if (getConfig('WEB_SCRAPER.ENABLED') as boolean) {
                    // Try multiple scraping methods
                    price = await scrapeCNBCStockPrice(company.symbol);
                    
                    if (price === null) {
                      price = await scrapeMarketWatchStockPrice(company.symbol);
                    }
                    
                    if (price === null) {
                      price = await extractYahooFinancePrice(company.symbol);
                    }
                    
                    if (price !== null) {
                      await new Promise(resolve => setTimeout(resolve, getConfig('WEB_SCRAPER.DELAY_BETWEEN_CALLS_MS') as number));
                    }
                  }
                  break;
                case 'MARKET_DATA':
                  if (getConfig('MARKET_DATA.ENABLED') as boolean) {
                    price = await fetchMarketDataPrice(company.symbol);
                    if (price === null) {
                      price = await fetchMarketDataPriceAlternative(company.symbol);
                    }
                    if (price !== null) {
                      await new Promise(resolve => setTimeout(resolve, getConfig('MARKET_DATA.DELAY_BETWEEN_CALLS_MS') as number));
                    }
                  }
                  break;
                case 'IEX_CLOUD':
                  if (getConfig('IEX_CLOUD.ENABLED') as boolean) {
                    price = await fetchIEXStockPrice(company.symbol);
                    if (price !== null) {
                      await new Promise(resolve => setTimeout(resolve, getConfig('IEX_CLOUD.DELAY_BETWEEN_CALLS_MS') as number));
                    }
                  }
                  break;
                case 'FINNHUB':
                  if (getConfig('FINNHUB.ENABLED') as boolean) {
                    price = await fetchFinnhubStockPrice(company.symbol);
                    if (price !== null) {
                      await new Promise(resolve => setTimeout(resolve, getConfig('FINNHUB.DELAY_BETWEEN_CALLS_MS') as number));
                    }
                  }
                  break;
                case 'YAHOO_FINANCE':
                  if (getConfig('YAHOO_FINANCE.ENABLED') as boolean) {
                    price = await fetchYahooStockPrice(company.symbol);
                    if (price !== null) {
                      await new Promise(resolve => setTimeout(resolve, getConfig('YAHOO_FINANCE.DELAY_BETWEEN_CALLS_MS') as number));
                    }
                  }
                  break;
                case 'ALPHA_VANTAGE':
                  price = await fetchStockPrice(company.symbol);
                  if (price === null) {
                    price = await fetchStockPriceAlternative(company.symbol);
                  }
                  if (price !== null) {
                    await new Promise(resolve => setTimeout(resolve, getConfig('ALPHA_VANTAGE.RATE_LIMIT.DELAY_BETWEEN_CALLS_MS') as number));
                  }
                  break;
              }
            }
          }
          
          // Skip API price if we should override with hardcoded price
          if (overrideAllApis && hardcodedPrice !== null) {
            console.log(`Skipping API price for ${company.symbol} in favor of hardcoded price: $${hardcodedPrice}`);
            continue;
          }
          
          if (price !== null) {
            console.log(`Successfully updated ${company.name} (${company.symbol}) price from $${company.price.toFixed(2)} to $${price.toFixed(2)}`);
            
            // Update the company in our copy
            updatedCompanies = updatedCompanies.map(c => 
              c.id === company.id ? { ...c, price: price } : c
            );
            
            // Also update the price in the portfolio if the user owns this stock
            if (portfolio[company.symbol]) {
              setPortfolio(prevPortfolio => ({
                ...prevPortfolio,
                [company.symbol]: {
                  ...prevPortfolio[company.symbol],
                  price: price
                }
              }));
            }
            
            updatedCount++;
          } else {
            console.log(`Failed to get real price for ${company.name} (${company.symbol}), keeping simulated price: $${company.price.toFixed(2)}`);
          }
        }
      }
      
      // Final verification for Costco to ensure it's using the hardcoded price if required
      if (forceCostcoHardcoded) {
        const costcoHardcodedPrice = getHardcodedPrice('COST');
        if (costcoHardcodedPrice !== null) {
          console.log('Final verification: Ensuring Costco uses hardcoded price');
          updatedCompanies = updatedCompanies.map(company => {
            if (company.symbol === 'COST' && company.price !== costcoHardcodedPrice) {
              console.log(`Overriding Costco price from $${company.price.toFixed(2)} to $${costcoHardcodedPrice.toFixed(2)} (hardcoded)`);
              return {
                ...company,
                price: costcoHardcodedPrice
              };
            }
            return company;
          });
          
          // Also ensure portfolio has the correct price
          if (portfolio['COST']) {
            setPortfolio(prevPortfolio => ({
              ...prevPortfolio,
              COST: {
                ...prevPortfolio.COST,
                price: costcoHardcodedPrice
              }
            }));
          }
        }
      }
      
      // Update state with all changes at once
      setCompanies(updatedCompanies);
      updatePortfolioValue(updatedCompanies);
      console.log(`Updated prices for ${updatedCount} out of ${companiesToFetchCount} companies`);
      
      if (updatedCount === 0) {
        Alert.alert(
          "API Error",
          "Could not fetch any real stock prices. This could be due to API rate limits or network issues. The app will continue using simulated prices.",
          [{ text: "OK" }]
        );
      } else if (updatedCount < companiesToFetchCount) {
        Alert.alert(
          "Partial Data",
          `Successfully fetched ${updatedCount} out of ${companiesToFetchCount} stock prices. Some stocks are using simulated prices.`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Success",
          `Successfully updated all ${updatedCount} stock prices with real market data.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error fetching real stock prices:', error);
      Alert.alert(
        "Error",
        "Failed to fetch real stock prices. The app will use simulated prices instead.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize filtered companies to prevent unnecessary recalculations
  const filteredCompanies = useMemo(() => {
    if (!companies || companies.length === 0) return [];
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [companies, searchQuery]);

  // Memoize portfolio value calculation
  const portfolioValue = useMemo(() => {
    return Object.values(portfolio).reduce((total, stock) => {
      return total + (stock.price * stock.shares);
    }, 0);
  }, [portfolio]);

  // Memoize portfolio chart data
  const portfolioChartData = useMemo(() => {
    const portfolioStocks = Object.values(portfolio);
    
    if (portfolioStocks.length === 0) {
      return [{ 
        name: 'No Stocks', 
        value: 100, 
        color: '#cccccc', 
        legendFontColor: '#7F7F7F', 
        legendFontSize: 15 
      }];
    }
    
    const totalValue = portfolioStocks.reduce(
      (total, stock) => total + (stock.price * stock.shares), 
      0
    );
    
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
      '#FF9F40', '#8AC046', '#EA5F89', '#00A8C6', '#9D7AC8',
      '#F9A603', '#48C9B0', '#E74C3C', '#3498DB', '#1ABC9C'
    ];
    
    return portfolioStocks.map((stock, index) => {
      const stockValue = stock.price * stock.shares;
      const percentage = (stockValue / totalValue) * 100;
      
            return {
        name: `${stock.symbol} (${stock.shares})`,
        value: parseFloat(percentage.toFixed(1)),
        color: colors[index % colors.length],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      };
    });
  }, [portfolio]);

  // Memoize the renderItem function for FlatList
  const renderStockItem = useCallback(({ item: company }) => {
    if (!company) return null;
    
    try {
      const previousPrice = company.previousPrice || company.price;
      const priceChange = company.price - previousPrice;
      const priceChangePercent = (priceChange / previousPrice) * 100;

      return (
        <TouchableOpacity 
          style={styles.stockItem}
          onPress={() => {
            setSelectedStock(company);
            setShowStockDetails(true);
          }}
        >
          <View style={styles.stockInfo}>
            <Text style={styles.stockSymbol}>{company.symbol}</Text>
            <Text style={styles.stockName}>{company.name}</Text>
          </View>
          <View style={styles.stockPrice}>
            <Text style={styles.priceText}>${company.price.toFixed(2)}</Text>
            <StockPerformanceIndicator
              change={priceChange}
              changePercent={priceChangePercent}
            />
          </View>
        </TouchableOpacity>
      );
    } catch (error) {
      console.error('Error rendering stock item:', error);
      return (
        <View style={styles.stockItem}>
          <Text style={styles.stockName}>Error loading stock data</Text>
        </View>
      );
    }
  }, []);

  // Add platform-specific haptics handling
  const triggerHaptic = (type: 'success' | 'error') => {
    if (Platform.OS === 'web') {
      // For web, just return without trying to use haptics
      return;
    }
    // For native platforms, try to use haptics
    try {
      const Haptics = require('expo-haptics');
      Haptics.notificationAsync(
        type === 'success' 
          ? Haptics.NotificationFeedbackType.Success 
          : Haptics.NotificationFeedbackType.Error
      );
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  };

  // Debugging: Log the search query and filtered results
  console.log('Search Query:', searchQuery);
  console.log('Filtered Companies:', filteredCompanies);

  const renderCompany = ({ item }) => (
    <View style={styles.company}>
      <Text>{item.name} ({item.symbol}): ${item.price.toFixed(2)}</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleBuyStock(item.symbol)}>
        <Text style={styles.buttonText}>Buy</Text>
      </TouchableOpacity>
    </View>
  );

  // Example data for the pie chart
  const stockData = [
    { name: 'AAPL', value: 50, color: '#f00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'GOOGL', value: 30, color: '#0f0', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'AMZN', value: 20, color: '#00f', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];

  // Generate pie chart data from portfolio
  const generatePortfolioChartData = () => {
    const portfolioStocks = Object.values(portfolio);
    
    // If no stocks in portfolio, return default message
    if (portfolioStocks.length === 0) {
      return [{ 
        name: 'No Stocks', 
        value: 100, 
        color: '#cccccc', 
        legendFontColor: '#7F7F7F', 
        legendFontSize: 15 
      }];
    }
    
    // Calculate total portfolio value
    const totalValue = portfolioStocks.reduce(
      (total, stock) => total + (stock.price * stock.shares), 
      0
    );
    
    // Define a set of distinct colors for the chart
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
      '#FF9F40', '#8AC046', '#EA5F89', '#00A8C6', '#9D7AC8',
      '#F9A603', '#48C9B0', '#E74C3C', '#3498DB', '#1ABC9C'
    ];
    
    // Create the chart data array
    return portfolioStocks.map((stock, index) => {
      const stockValue = stock.price * stock.shares;
      const percentage = (stockValue / totalValue) * 100;
      
      return {
        name: `${stock.symbol} (${stock.shares})`,
        value: parseFloat(percentage.toFixed(1)),
        color: colors[index % colors.length],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      };
    });
  };

  // Calculate total portfolio value
  const calculatePortfolioValue = () => {
    return Object.values(portfolio).reduce((total, stock) => {
      return total + (stock.price * stock.shares);
    }, 0);
  };

  // Update the refreshNews function
  const refreshNews = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newNewsItem = {
        id: Date.now().toString(),
        title: 'Breaking: Market Update',
        date: new Date().toISOString(),
        url: 'https://example.com/news/latest',
        imageUrl: 'https://via.placeholder.com/300x200',
        summary: 'Latest market movements and analysis for today\'s trading session.',
        relatedTickers: ['SPY', 'QQQ', 'DIA']
      };
      
      setNewsItems(prevNews => [newNewsItem, ...prevNews]);
      setIsLoading(false);
    }, 1000);
  };

  // Add error handling for tab switching
  const handleTabChange = (tab: string) => {
    try {
      console.log(`Switching to tab: ${tab}`);
      setActiveTab(tab);
      
      // If switching to market tab, ensure companies are loaded
      if (tab === 'market' && (!companies || companies.length === 0)) {
        console.log('Market tab selected but no companies loaded, initializing...');
        const initialCompanies = generateMockCompanies(50);
        setCompanies(initialCompanies);
      }
    } catch (error) {
      console.error('Error switching tabs:', error);
      // Fallback to portfolio tab if there's an error
      setActiveTab('portfolio');
    }
  };

  // Add this function to handle challenge completion
  const handleChallengeComplete = (challengeId: string, reward: number) => {
    console.log(`Challenge completed: ${challengeId}, Reward: $${reward}`);
    // Additional logic for challenge completion can be added here
  };

  return (
    <Background>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        overScrollMode="always"
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchRealStockPrices}
            tintColor="#000"
            title="Pull to refresh..."
          />
        }
      >
        <View style={[styles.container]}>
          {/* Settings Modal */}
          <Settings
            visible={showSettings}
            onClose={() => setShowSettings(false)}
            onSaveGame={saveGameState}
            onLoadGame={loadGameState}
            onShowTutorial={() => {
              setShowSettings(false);
              setShowTutorial(true);
            }}
          />

          {/* Challenges Modal */}
          <Challenges
            visible={showChallenges}
            onClose={() => setShowChallenges(false)}
            onCompleteChallenge={handleChallengeComplete}
            cash={cash}
            setCash={setCash}
            gameState={{
              portfolioValue: calculatePortfolioValue(),
              profitableTrades: Object.values(portfolio).filter(stock => stock.price > stock.purchasePrice).length,
              portfolioSectors: [...new Set(Object.values(portfolio).map(stock => stock.sector))],
              tradesToday: 0, // This would need to be tracked separately
              largestTrade: Math.max(...Object.values(portfolio).map(stock => stock.price * stock.shares), 0),
              highestProfitPercent: Math.max(...Object.values(portfolio).map(stock => 
                ((stock.price - stock.purchasePrice) / stock.purchasePrice) * 100
              ), 0),
              longestHoldingDays: 0 // This would need to be tracked separately
            }}
          />

          {/* Tutorial Modal */}
          <Tutorial
            visible={showTutorial}
            onClose={() => setShowTutorial(false)}
          />

          {/* Navigation Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Stock Tycoon</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setShowChallenges(true)}
              >
                <Ionicons name="trophy-outline" size={24} color="#FFD700" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setShowSettings(true)}
              >
                <Ionicons name="settings-outline" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Navigation Header */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'portfolio' && styles.activeTab]}
              onPress={() => handleTabChange('portfolio')}
            >
              <Text style={styles.tabText}>Portfolio</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'market' && styles.activeTab]}
              onPress={() => handleTabChange('market')}
            >
              <Text style={styles.tabText}>Market</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'news' && styles.activeTab]}
              onPress={() => handleTabChange('news')}
            >
              <Text style={styles.tabText}>News</Text>
            </TouchableOpacity>
          </View>

          {/* Market Indices (always visible) */}
          <MarketIndices
            indices={marketIndices}
            isLoading={isLoading}
            onRefresh={fetchRealStockPrices}
          />

          {/* Net Worth Display (always visible) */}
          <NetWorthDisplay
            cash={cash}
            portfolioValue={portfolioValue}
            income={income}
            expenses={expenses}
            netWorth={cash + portfolioValue}
            dailyChange={dailyChange}
            dailyChangePercent={dailyChangePercent}
          />

          {activeTab === 'portfolio' && (
            <>
              <View style={styles.buttonContainer}>
                {/* Add refresh button */}
                <TouchableOpacity 
                  style={styles.refreshButton} 
                  onPress={() => {
                    Alert.alert(
                      "Refresh Stock Prices",
                      "Do you want to refresh stock prices with real market data?",
                      [
                        { text: "Cancel", style: "cancel" },
                        { 
                          text: "Refresh", 
                          onPress: () => fetchRealStockPrices() 
                        }
                      ]
                    );
                  }}
                >
                  <Text style={styles.buttonText}>Refresh Stock Prices</Text>
                </TouchableOpacity>
                
                {/* Add guaranteed accurate prices button */}
                <TouchableOpacity 
                  style={styles.accurateButton} 
                  onPress={() => {
                    // Implementation of updateWithHardcodedPrices function
                  }}
                >
                  <Text style={styles.buttonText}>Use Guaranteed Accurate Prices</Text>
                </TouchableOpacity>
                
                {/* Add most accurate prices button */}
                <TouchableOpacity 
                  style={styles.mostAccurateButton} 
                  onPress={() => {
                    // Implementation of updateWithMostAccuratePrices function
                  }}
                >
                  <Text style={styles.buttonText}>Force Update All Prices</Text>
                </TouchableOpacity>
              </View>
              
              {/* Portfolio Manager */}
              <PortfolioManager
                portfolio={portfolio}
                onBuyStock={(symbol) => handleBuyStock(symbol)}
                onSellStock={(symbol) => handleSellStock(symbol)}
              />

              {/* Portfolio Chart (keep existing implementation) */}
              {Object.values(portfolio).length > 0 && (
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Portfolio Allocation</Text>
                  <PieChart
                    data={generatePortfolioChartData()}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="value"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute={false}
                    hasLegend={true}
                  />
                </View>
              )}
            </>
          )}

          {activeTab === 'market' && (
            <View style={styles.marketContainer}>
              {/* Stock Filters */}
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setShowFilters(true)}
              >
                <Text style={styles.buttonText}>Filter & Sort</Text>
              </TouchableOpacity>

              <StockFilters
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                onApplyFilters={(sortOption, filters) => {
                  // Apply filters to filteredCompanies
                  setShowFilters(false);
                }}
              />

              {/* Search and Stock List */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search companies..."
        value={searchQuery}
                onChangeText={handleSearch}
              />

              {companies.length === 0 ? (
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>Loading companies...</Text>
                  <TouchableOpacity 
                    style={styles.refreshButton}
                    onPress={fetchRealStockPrices}
                  >
                    <Text style={styles.buttonText}>Refresh</Text>
                    </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={filteredCompanies}
                  renderItem={renderStockItem}
        keyExtractor={(item) => item.id}
                  ListEmptyComponent={() => (
                    <View style={styles.emptyListContainer}>
                      <Text style={styles.emptyListText}>No companies found</Text>
                    </View>
                  )}
                  contentContainerStyle={styles.listContentContainer}
                  showsVerticalScrollIndicator={false}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={5}
                  removeClippedSubviews={true}
                  getItemLayout={(data, index) => ({
                    length: 80,
                    offset: 80 * index,
                    index,
                  })}
                  scrollEventThrottle={16}
                />
              )}
            </View>
          )}

          {activeTab === 'news' && (
            <View style={styles.newsContainer}>
            <NewsFeed
                news={newsItems || []}
              isLoading={isLoading}
              onRefresh={refreshNews}
              filterByTicker={selectedStock?.symbol}
            />
            </View>
          )}

          {/* Stock Details Modal */}
          <StockDetails
            isVisible={showStockDetails}
            stock={selectedStock}
            onClose={() => setShowStockDetails(false)}
            onBuy={() => {
              handleBuyStock(selectedStock.symbol);
              setShowStockDetails(false);
            }}
          />

          {/* Save/Load Game buttons */}
          <View style={styles.gameControls}>
      <TouchableOpacity style={styles.button} onPress={saveGameState}>
        <Text style={styles.buttonText}>Save Game</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={loadGameState}>
        <Text style={styles.buttonText}>Load Game</Text>
      </TouchableOpacity>
    </View>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingBottom: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 10,
    alignItems: 'stretch',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 5,
    marginLeft: 10,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  company: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: 'rgba(204, 204, 204, 0.8)',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  stockName: {
    fontSize: 14,
    marginTop: 4,
  },
  stockPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  refreshButton: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  accurateButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
  },
  mostAccurateButton: {
    backgroundColor: '#673AB7', // Purple color for the new button
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
  },
  chartContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(249, 249, 249, 0.95)',
    borderRadius: 10,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  portfolioValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    width: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(238, 238, 238, 0.5)',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#4a90e2',
  },
  tabText: {
    color: '#333',
    fontWeight: '500',
  },
  filterButton: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  gameControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(238, 238, 238, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyListText: {
    color: '#777',
    fontSize: 16,
  },
  listContentContainer: {
    padding: 10,
  },
  newsContainer: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 10,
    minHeight: 300,
  },
  marketContainer: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 10,
  },
});

export default App; 