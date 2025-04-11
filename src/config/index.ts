export const config = {
  FEATURES: {
    USE_REAL_DATA: false,
    COMPANIES_TO_FETCH: ['COST', 'AAPL', 'MSFT'],
    USE_BATCH_FETCHING: true,
    FORCE_HARDCODED_COSTCO: false
  },
  HARDCODED_PRICES: {
    ENABLED: true,
    USE_EXCLUSIVELY: false,
    OVERRIDE_ALL_APIS: false,
    PRICES: {
      'COST': 485.98,  // Example hardcoded price for Costco
      'AAPL': 175.21,  // Example hardcoded price for Apple
      'MSFT': 338.11   // Example hardcoded price for Microsoft
    }
  },
  API_PRIORITY: [
    'DIRECT_STOCK',
    'HARDCODED_PRICES'
  ],
  DIRECT_STOCK: {
    ENABLED: true,
    BATCH_SIZE: 10,
    DELAY_BETWEEN_CALLS_MS: 1000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 2000
  }
};

export const getConfig = () => config;

export const getHardcodedPrice = (ticker: string): number | null => {
  if (!config.HARDCODED_PRICES.ENABLED) return null;
  return config.HARDCODED_PRICES.PRICES[ticker] || null;
};

export const getHardcodedPrices = (tickers: string[]): Record<string, number> => {
  if (!config.HARDCODED_PRICES.ENABLED) return {};
  
  const result: Record<string, number> = {};
  for (const ticker of tickers) {
    const price = getHardcodedPrice(ticker);
    if (price !== null) {
      result[ticker] = price;
    }
  }
  return result;
}; 