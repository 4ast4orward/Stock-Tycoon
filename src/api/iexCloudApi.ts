import axios from 'axios';
import { getConfig } from '../config/apiConfig';

// Function to fetch real-time stock data for a single ticker using IEX Cloud
export const fetchIEXStockPrice = async (ticker: string): Promise<number | null> => {
  console.log(`Attempting to fetch IEX Cloud price for ${ticker}...`);
  
  const API_KEY = getConfig('IEX_CLOUD.API_KEY') as string;
  const BASE_URL = getConfig('IEX_CLOUD.BASE_URL') as string;
  const DELAY_BETWEEN_CALLS = getConfig('IEX_CLOUD.RATE_LIMIT.DELAY_BETWEEN_CALLS_MS') as number;
  
  if (!API_KEY) {
    console.error('IEX Cloud API key is not configured');
    return null;
  }
  
  try {
    // IEX Cloud API endpoint for real-time quote
    const url = `${BASE_URL}/stock/${ticker}/quote?token=${API_KEY}`;
    console.log(`IEX Cloud API Request URL: ${url}`);
    
    const response = await axios.get(url);
    
    // Validate response data
    if (!response.data) {
      throw new Error('Empty response from IEX Cloud API');
    }
    
    // Check if we have valid data
    if (response.data.latestPrice) {
      const price = response.data.latestPrice;
      console.log(`Successfully fetched IEX Cloud price for ${ticker}: $${price}`);
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CALLS));
      
      return price;
    }
    
    // Check for specific error messages from IEX Cloud
    if (response.data.error) {
      console.error(`IEX Cloud API error: ${response.data.error}`);
      return null;
    }
    
    console.error('Invalid IEX Cloud response format:', JSON.stringify(response.data));
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        console.error('Rate limit exceeded for IEX Cloud API');
      } else if (error.response?.status === 401) {
        console.error('Invalid API key for IEX Cloud');
      } else if (error.response?.status === 404) {
        console.error(`Stock symbol ${ticker} not found`);
      } else {
        console.error(`IEX Cloud API error: ${error.response?.status} - ${error.response?.statusText}`);
      }
    } else {
      console.error(`Error fetching IEX Cloud price for ${ticker}:`, error);
    }
    return null;
  }
};

// Function to fetch multiple stock prices in batch
export const fetchIEXBatchPrices = async (tickers: string[]): Promise<Record<string, number>> => {
  const results: Record<string, number> = {};
  const DELAY_BETWEEN_CALLS = getConfig('IEX_CLOUD.RATE_LIMIT.DELAY_BETWEEN_CALLS_MS') as number;
  
  for (const ticker of tickers) {
    const price = await fetchIEXStockPrice(ticker);
    if (price !== null) {
      results[ticker] = price;
    }
    // Add delay between calls
    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CALLS));
  }
  
  return results;
}; 