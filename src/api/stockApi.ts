import axios from 'axios';
import { getConfig } from '../config/apiConfig';

// Get API configuration
const API_KEY = getConfig('ALPHA_VANTAGE.API_KEY') as string;
const BASE_URL = getConfig('ALPHA_VANTAGE.BASE_URL') as string;
const DELAY_BETWEEN_CALLS = getConfig('ALPHA_VANTAGE.RATE_LIMIT.DELAY_BETWEEN_CALLS_MS') as number;

// Function to fetch real-time stock data for a single ticker
export const fetchStockPrice = async (ticker: string): Promise<number | null> => {
  console.log(`Attempting to fetch real price for ${ticker}...`);
  
  try {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;
    console.log(`API Request URL: ${url}`);
    
    const response = await axios.get(url);
    console.log(`API Response for ${ticker}:`, JSON.stringify(response.data));
    
    if (response.data['Global Quote'] && response.data['Global Quote']['05. price']) {
      const price = parseFloat(response.data['Global Quote']['05. price']);
      console.log(`Successfully fetched price for ${ticker}: $${price}`);
      return price;
    } else if (response.data.Note) {
      // Alpha Vantage returns a Note field when there's an API limit issue
      console.error(`API Limit reached: ${response.data.Note}`);
      return null;
    } else {
      console.error('Invalid response format:', JSON.stringify(response.data));
      return null;
    }
  } catch (error) {
    console.error(`Error fetching stock price for ${ticker}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
    }
    return null;
  }
};

// Alternative method using TIME_SERIES_DAILY endpoint
export const fetchStockPriceAlternative = async (ticker: string): Promise<number | null> => {
  console.log(`Attempting to fetch real price for ${ticker} using alternative method...`);
  
  try {
    const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${API_KEY}`;
    console.log(`Alternative API Request URL: ${url}`);
    
    const response = await axios.get(url);
    console.log(`Alternative API Response for ${ticker} (partial):`, 
      JSON.stringify(response.data).substring(0, 300) + '...');
    
    // Check if we have the time series data
    if (response.data['Time Series (Daily)']) {
      // Get the most recent date (first key in the time series)
      const dates = Object.keys(response.data['Time Series (Daily)']);
      if (dates.length > 0) {
        const latestDate = dates[0];
        const latestData = response.data['Time Series (Daily)'][latestDate];
        
        if (latestData['4. close']) {
          const price = parseFloat(latestData['4. close']);
          console.log(`Successfully fetched price for ${ticker} using alternative method: $${price} (date: ${latestDate})`);
          return price;
        }
      }
    } else if (response.data.Note) {
      console.error(`API Limit reached: ${response.data.Note}`);
      return null;
    }
    
    console.error('Invalid response format from alternative method');
    return null;
  } catch (error) {
    console.error(`Error fetching stock price for ${ticker} using alternative method:`, error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
    }
    return null;
  }
};

// Function to fetch batch stock data (for multiple tickers)
export const fetchBatchStockPrices = async (tickers: string[]): Promise<Record<string, number>> => {
  const results: Record<string, number> = {};
  
  console.log(`Attempting to fetch prices for ${tickers.length} stocks: ${tickers.join(', ')}`);
  
  // Due to API limitations, we'll fetch them one by one
  for (const ticker of tickers) {
    // Try the primary method first
    let price = await fetchStockPrice(ticker);
    
    // If primary method fails, try the alternative
    if (price === null) {
      console.log(`Primary method failed for ${ticker}, trying alternative method...`);
      price = await fetchStockPriceAlternative(ticker);
    }
    
    if (price !== null) {
      results[ticker] = price;
    }
    
    // Add a delay to avoid hitting rate limits
    console.log(`Waiting ${DELAY_BETWEEN_CALLS}ms before next API call...`);
    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CALLS));
  }
  
  console.log(`Fetched ${Object.keys(results).length} out of ${tickers.length} stock prices`);
  return results;
};

// Function to get a simulated price if the API fails or for testing
export const getSimulatedPrice = (ticker: string, basePrice?: number): number => {
  // Base prices for some common stocks
  const basePrices: { [key: string]: number } = {
    'AAPL': 175.50,
    'GOOGL': 140.20,
    'MSFT': 380.40,
    'AMZN': 145.80,
    'META': 485.90,
    'TSLA': 185.30,
    'NVDA': 780.50,
    'JPM': 172.40,
    'V': 275.60,
    'WMT': 165.20,
    'PG': 155.30,
    'JNJ': 158.40,
    'XOM': 105.70,
    'BAC': 34.20,
    'MA': 470.80,
    'HD': 370.90,
    'CVX': 155.60,
    'PFE': 27.40,
    'COST': 730.50,
    'ABBV': 170.30,
  };

  // If we have a base price from previous update, use that
  if (basePrice) {
    // Generate a random percentage change between -1% and +1%
    const changePercent = (Math.random() * 2 - 1) * 0.01;
    return basePrice * (1 + changePercent);
  }

  // If we have a predefined base price for this ticker, use it
  if (basePrices[ticker]) {
    // Add some initial randomness (-5% to +5%)
    const initialRandomness = (Math.random() * 0.1 - 0.05);
    return basePrices[ticker] * (1 + initialRandomness);
  }

  // For any other ticker, generate a reasonable random price between $10 and $500
  return Math.random() * 490 + 10;
}; 