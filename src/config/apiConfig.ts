import { Platform } from 'react-native';

// Environment configuration
const ENV = {
  dev: {
    ALPHA_VANTAGE: {
      API_KEY: process.env.ALPHA_VANTAGE_API_KEY || '',
      BASE_URL: 'https://www.alphavantage.co/query',
      RATE_LIMIT: {
        DELAY_BETWEEN_CALLS_MS: 12000, // 12 seconds between calls
        MAX_CALLS_PER_MINUTE: 5
      }
    },
    FINNHUB: {
      API_KEY: process.env.FINNHUB_API_KEY || '',
      BASE_URL: 'https://finnhub.io/api/v1',
      RATE_LIMIT: {
        DELAY_BETWEEN_CALLS_MS: 6000, // 6 seconds between calls
        MAX_CALLS_PER_MINUTE: 10
      }
    },
    IEX_CLOUD: {
      API_KEY: process.env.IEX_CLOUD_API_KEY || '',
      BASE_URL: 'https://cloud.iexapis.com/stable',
      RATE_LIMIT: {
        DELAY_BETWEEN_CALLS_MS: 8000, // 8 seconds between calls
        MAX_CALLS_PER_MINUTE: 8
      }
    },
    DIRECT_STOCK: {
      ENABLED: true,
      DELAY_BETWEEN_CALLS_MS: 5000, // 5 seconds between calls
      USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    FEATURES: {
      USE_REAL_DATA: true,
      ENABLE_ANIMATIONS: true,
      ENABLE_OFFLINE_MODE: true,
      ENABLE_CACHING: true
    }
  },
  prod: {
    // Production configuration (same structure as dev)
    ALPHA_VANTAGE: {
      API_KEY: process.env.ALPHA_VANTAGE_API_KEY || '',
      BASE_URL: 'https://www.alphavantage.co/query',
      RATE_LIMIT: {
        DELAY_BETWEEN_CALLS_MS: 12000,
        MAX_CALLS_PER_MINUTE: 5
      }
    },
    FINNHUB: {
      API_KEY: process.env.FINNHUB_API_KEY || '',
      BASE_URL: 'https://finnhub.io/api/v1',
      RATE_LIMIT: {
        DELAY_BETWEEN_CALLS_MS: 6000,
        MAX_CALLS_PER_MINUTE: 10
      }
    },
    IEX_CLOUD: {
      API_KEY: process.env.IEX_CLOUD_API_KEY || '',
      BASE_URL: 'https://cloud.iexapis.com/stable',
      RATE_LIMIT: {
        DELAY_BETWEEN_CALLS_MS: 8000,
        MAX_CALLS_PER_MINUTE: 8
      }
    },
    DIRECT_STOCK: {
      ENABLED: true,
      DELAY_BETWEEN_CALLS_MS: 5000,
      USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    FEATURES: {
      USE_REAL_DATA: true,
      ENABLE_ANIMATIONS: true,
      ENABLE_OFFLINE_MODE: true,
      ENABLE_CACHING: true
    }
  }
};

// Get current environment
const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev;
  }
  return ENV.prod;
};

// Configuration getter with type safety
export const getConfig = (path: string): any => {
  const env = getEnvVars();
  const parts = path.split('.');
  let current: any = env;
  
  for (const part of parts) {
    if (current && typeof current === 'object') {
      current = current[part];
    } else {
      console.warn(`Config path "${path}" not found`);
      return null;
    }
  }
  
  return current;
};

// Validate configuration
export const validateConfig = (): string[] => {
  const errors: string[] = [];
  const env = getEnvVars();
  
  // Check API keys
  if (!env.ALPHA_VANTAGE.API_KEY) errors.push('ALPHA_VANTAGE_API_KEY is missing');
  if (!env.FINNHUB.API_KEY) errors.push('FINNHUB_API_KEY is missing');
  if (!env.IEX_CLOUD.API_KEY) errors.push('IEX_CLOUD_API_KEY is missing');
  
  // Check rate limits
  if (env.ALPHA_VANTAGE.RATE_LIMIT.MAX_CALLS_PER_MINUTE <= 0) {
    errors.push('Invalid ALPHA_VANTAGE rate limit');
  }
  if (env.FINNHUB.RATE_LIMIT.MAX_CALLS_PER_MINUTE <= 0) {
    errors.push('Invalid FINNHUB rate limit');
  }
  if (env.IEX_CLOUD.RATE_LIMIT.MAX_CALLS_PER_MINUTE <= 0) {
    errors.push('Invalid IEX_CLOUD rate limit');
  }
  
  return errors;
};

// API Configuration
export const API_CONFIG = {
  // Alpha Vantage API settings
  ALPHA_VANTAGE: {
    API_KEY: '01ea7094-5356-438a-aaee-9b7ea80bfac9', // API key provided by user
    BASE_URL: 'https://www.alphavantage.co/query',
    RATE_LIMIT: {
      CALLS_PER_MINUTE: 5,
      CALLS_PER_DAY: 500,
      DELAY_BETWEEN_CALLS_MS: 12000, // 12 seconds between calls to stay within rate limit
    }
  },
  
  // Yahoo Finance API settings (no API key required)
  YAHOO_FINANCE: {
    ENABLED: true,
    DELAY_BETWEEN_CALLS_MS: 1000, // 1 second between calls
  },
  
  // Finnhub API settings
  FINNHUB: {
    ENABLED: true,
    API_KEY: 'ck2v5tpr01qus5a1rl10ck2v5tpr01qus5a1rl1g', // Real API key
    DELAY_BETWEEN_CALLS_MS: 500, // 0.5 seconds between calls
  },
  
  // IEX Cloud API settings
  IEX_CLOUD: {
    ENABLED: true,
    API_KEY: 'pk_9eb49acc515d42f9900e8c42fb2a0a4e', // Public test key
    DELAY_BETWEEN_CALLS_MS: 250, // 0.25 seconds between calls
  },
  
  // Direct Market Data API settings (no API key required)
  MARKET_DATA: {
    ENABLED: true,
    DELAY_BETWEEN_CALLS_MS: 500, // 0.5 seconds between calls
  },
  
  // Web Scraper API settings (no API key required)
  WEB_SCRAPER: {
    ENABLED: true,
    DELAY_BETWEEN_CALLS_MS: 1000, // 1 second between calls to avoid being blocked
  },
  
  // Direct Stock API settings (no API key required)
  DIRECT_STOCK: {
    ENABLED: true,
    DELAY_BETWEEN_CALLS_MS: 500, // 0.5 seconds between calls
    BATCH_SIZE: 20, // Number of stocks to fetch in a single batch request
  },
  
  // Hardcoded Prices settings
  HARDCODED_PRICES: {
    ENABLED: true,
    USE_EXCLUSIVELY: true, // Always use hardcoded prices for stocks that have them
    OVERRIDE_ALL_APIS: true, // Always prefer hardcoded prices over any API result
  },
  
  // Feature flags
  FEATURES: {
    USE_REAL_DATA: true, // Set to false to use only simulated data
    COMPANIES_TO_FETCH: 100, // Increased to fetch more companies
    REFRESH_INTERVAL_MS: 3600000, // Refresh real data every hour
    USE_BATCH_FETCHING: true, // Use batch fetching for efficiency
    FORCE_HARDCODED_COSTCO: true, // Always use hardcoded price for Costco
  },
  
  // API Priority (order to try APIs)
  API_PRIORITY: ['HARDCODED_PRICES', 'DIRECT_STOCK', 'WEB_SCRAPER', 'MARKET_DATA', 'IEX_CLOUD', 'FINNHUB', 'YAHOO_FINANCE', 'ALPHA_VANTAGE']
};

// Define a type for the config paths
type ConfigPath = 
  | 'ALPHA_VANTAGE.API_KEY'
  | 'ALPHA_VANTAGE.BASE_URL'
  | 'ALPHA_VANTAGE.RATE_LIMIT.CALLS_PER_MINUTE'
  | 'ALPHA_VANTAGE.RATE_LIMIT.CALLS_PER_DAY'
  | 'ALPHA_VANTAGE.RATE_LIMIT.DELAY_BETWEEN_CALLS_MS'
  | 'YAHOO_FINANCE.ENABLED'
  | 'YAHOO_FINANCE.DELAY_BETWEEN_CALLS_MS'
  | 'FINNHUB.ENABLED'
  | 'FINNHUB.API_KEY'
  | 'FINNHUB.DELAY_BETWEEN_CALLS_MS'
  | 'IEX_CLOUD.ENABLED'
  | 'IEX_CLOUD.API_KEY'
  | 'IEX_CLOUD.DELAY_BETWEEN_CALLS_MS'
  | 'MARKET_DATA.ENABLED'
  | 'MARKET_DATA.DELAY_BETWEEN_CALLS_MS'
  | 'WEB_SCRAPER.ENABLED'
  | 'WEB_SCRAPER.DELAY_BETWEEN_CALLS_MS'
  | 'DIRECT_STOCK.ENABLED'
  | 'DIRECT_STOCK.DELAY_BETWEEN_CALLS_MS'
  | 'DIRECT_STOCK.BATCH_SIZE'
  | 'HARDCODED_PRICES.ENABLED'
  | 'HARDCODED_PRICES.USE_EXCLUSIVELY'
  | 'HARDCODED_PRICES.OVERRIDE_ALL_APIS'
  | 'FEATURES.USE_REAL_DATA'
  | 'FEATURES.COMPANIES_TO_FETCH'
  | 'FEATURES.REFRESH_INTERVAL_MS'
  | 'FEATURES.USE_BATCH_FETCHING'
  | 'FEATURES.FORCE_HARDCODED_COSTCO'
  | 'API_PRIORITY';

// Export a function to get a specific config value with proper typing
export const getConfigTyped = (path: ConfigPath): string | number | boolean | string[] => {
  const parts = path.split('.');
  let result: any = API_CONFIG;
  
  for (const part of parts) {
    if (result && result[part] !== undefined) {
      result = result[part];
    } else {
      return undefined as any;
    }
  }
  
  return result;
}; 