import { getConfig } from '../config';
import { Stock } from '../types';

const COSTCO_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/COST';
const YAHOO_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/';

const config = getConfig();

export const fetchCostcoDirectPrice = async (): Promise<number | null> => {
  try {
    const response = await fetch(COSTCO_URL);
    const data = await response.json();
    return data?.chart?.result?.[0]?.meta?.regularMarketPrice || null;
  } catch (error) {
    console.error('Error fetching Costco price:', error);
    return null;
  }
};

export const fetchYahooDirectPrice = async (symbol: string): Promise<number | null> => {
  try {
    const response = await fetch(`${YAHOO_BASE_URL}${symbol}`);
    const data = await response.json();
    return data?.chart?.result?.[0]?.meta?.regularMarketPrice || null;
  } catch (error) {
    console.error(`Error fetching ${symbol} price:`, error);
    return null;
  }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchBatchPrices = async (symbols: string[]): Promise<Record<string, number>> => {
  const { BATCH_SIZE, DELAY_BETWEEN_CALLS_MS, RETRY_ATTEMPTS, RETRY_DELAY_MS } = config.DIRECT_STOCK;
  
  const results: Record<string, number> = {};
  const batches = [];
  
  // Split symbols into batches
  for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    batches.push(symbols.slice(i, i + BATCH_SIZE));
  }
  
  // Process each batch with delay and retry logic
  for (const batch of batches) {
    let attempts = 0;
    let success = false;
    
    while (attempts < RETRY_ATTEMPTS && !success) {
      try {
        const batchPromises = batch.map(async (symbol) => {
          const price = await fetchYahooDirectPrice(symbol);
          if (price !== null) {
            results[symbol] = price;
          }
        });
        
        await Promise.all(batchPromises);
        success = true;
      } catch (error) {
        attempts++;
        console.error(`Batch attempt ${attempts} failed:`, error);
        if (attempts < RETRY_ATTEMPTS) {
          await sleep(RETRY_DELAY_MS);
        }
      }
    }
    
    if (batches.indexOf(batch) < batches.length - 1) {
      await sleep(DELAY_BETWEEN_CALLS_MS);
    }
  }
  
  return results;
};

export const updateStockPrice = (stock: Stock, newPrice: number): Stock => {
  const previousPrice = stock.price;
  const change = newPrice - previousPrice;
  const changePercent = (change / previousPrice) * 100;
  
  return {
    ...stock,
    price: newPrice,
    previousPrice,
    change,
    changePercent
  };
}; 