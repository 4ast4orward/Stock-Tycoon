import axios from 'axios';
import { getConfig } from '../config/apiConfig';

// Function to fetch real-time stock data for a single ticker using Finnhub
export const fetchFinnhubStockPrice = async (ticker: string): Promise<number | null> => {
  console.log(`Attempting to fetch Finnhub price for ${ticker}...`);
  
  const API_KEY = getConfig('FINNHUB.API_KEY') as string;
  const BASE_URL = getConfig('FINNHUB.BASE_URL') as string;
  const DELAY_BETWEEN_CALLS = getConfig('FINNHUB.RATE_LIMIT.DELAY_BETWEEN_CALLS_MS') as number;
  
  if (!API_KEY) {
    console.error('Finnhub API key is not configured');
    return null;
  }
  
  try {
    // Finnhub API endpoint for real-time quote
    const url = `${BASE_URL}/quote?symbol=${ticker}&token=${API_KEY}`;
    console.log(`Finnhub API Request URL: ${url}`);
    
    const response = await axios.get(url);
    
    // Validate response data
    if (!response.data) {
      throw new Error('Empty response from Finnhub API');
    }
    
    // Check if we have valid data
    if (response.data.c && response.data.c > 0) {
      const price = response.data.c; // Current price
      console.log(`Successfully fetched Finnhub price for ${ticker}: $${price}`);
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CALLS));
      
      return price;
    }
    
    // Check for specific error messages from Finnhub
    if (response.data.error) {
      console.error(`Finnhub API error: ${response.data.error}`);
      return null;
    }
    
    console.error('Invalid Finnhub response format:', JSON.stringify(response.data));
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        console.error('Rate limit exceeded for Finnhub API');
      } else if (error.response?.status === 401) {
        console.error('Invalid API key for Finnhub');
      } else if (error.response?.status === 404) {
        console.error(`Stock symbol ${ticker} not found`);
      } else {
        console.error(`Finnhub API error: ${error.response?.status} - ${error.response?.statusText}`);
      }
    } else {
      console.error(`Error fetching Finnhub price for ${ticker}:`, error);
    }
    return null;
  }
};

// Function to fetch multiple stock prices in batch
export const fetchFinnhubBatchPrices = async (tickers: string[]): Promise<Record<string, number>> => {
  const results: Record<string, number> = {};
  const DELAY_BETWEEN_CALLS = getConfig('FINNHUB.RATE_LIMIT.DELAY_BETWEEN_CALLS_MS') as number;
  
  for (const ticker of tickers) {
    const price = await fetchFinnhubStockPrice(ticker);
    if (price !== null) {
      results[ticker] = price;
    }
    // Add delay between calls
    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CALLS));
  }
  
  return results;
}; 