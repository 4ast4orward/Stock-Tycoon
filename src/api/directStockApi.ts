import axios from 'axios';

/**
 * Direct Stock API - Uses reliable public endpoints to fetch stock prices
 * This module focuses on simplicity and reliability
 */

// Function to fetch stock price from Yahoo Finance API (most reliable)
export const fetchYahooDirectPrice = async (ticker: string): Promise<number | null> => {
  console.log(`Attempting to fetch Yahoo direct price for ${ticker}...`);
  
  try {
    // Using Yahoo Finance v7 API - most reliable public endpoint
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`;
    console.log(`Yahoo Direct API URL: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Check if we have valid data
    if (response.data && 
        response.data.quoteResponse && 
        response.data.quoteResponse.result && 
        response.data.quoteResponse.result.length > 0) {
      
      const result = response.data.quoteResponse.result[0];
      
      if (result.regularMarketPrice) {
        const price = result.regularMarketPrice;
        console.log(`Successfully fetched Yahoo direct price for ${ticker}: $${price}`);
        return price;
      }
    }
    
    console.error(`Invalid response format from Yahoo direct API for ${ticker}`);
    return null;
  } catch (error) {
    console.error(`Error fetching Yahoo direct price for ${ticker}:`, error);
    return null;
  }
};

// Function to fetch stock price from a backup Yahoo Finance endpoint
export const fetchYahooBackupPrice = async (ticker: string): Promise<number | null> => {
  console.log(`Attempting to fetch Yahoo backup price for ${ticker}...`);
  
  try {
    // Using Yahoo Finance v8 API as backup
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
    console.log(`Yahoo Backup API URL: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Check if we have valid data
    if (response.data && 
        response.data.chart && 
        response.data.chart.result && 
        response.data.chart.result.length > 0) {
      
      const result = response.data.chart.result[0];
      
      if (result.meta && result.meta.regularMarketPrice) {
        const price = result.meta.regularMarketPrice;
        console.log(`Successfully fetched Yahoo backup price for ${ticker}: $${price}`);
        return price;
      }
    }
    
    console.error(`Invalid response format from Yahoo backup API for ${ticker}`);
    return null;
  } catch (error) {
    console.error(`Error fetching Yahoo backup price for ${ticker}:`, error);
    return null;
  }
};

// Function specifically for Costco (COST) stock price
export const fetchCostcoDirectPrice = async (): Promise<number | null> => {
  console.log('Attempting to fetch Costco price using direct API...');
  
  try {
    // Try multiple endpoints for redundancy
    const endpoints = [
      { name: 'Yahoo v7', url: 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=COST' },
      { name: 'Yahoo v8', url: 'https://query1.finance.yahoo.com/v8/finance/chart/COST?interval=1d&range=1d' },
      { name: 'Yahoo v10', url: 'https://query2.finance.yahoo.com/v10/finance/quoteSummary/COST?modules=price' }
    ];
    
    for (const endpoint of endpoints) {
      console.log(`Trying to fetch Costco price from ${endpoint.name}: ${endpoint.url}`);
      
      const response = await axios.get(endpoint.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      let price = null;
      
      if (endpoint.name === 'Yahoo v7') {
        if (response.data && 
            response.data.quoteResponse && 
            response.data.quoteResponse.result && 
            response.data.quoteResponse.result.length > 0) {
          
          const result = response.data.quoteResponse.result[0];
          
          if (result.regularMarketPrice) {
            price = result.regularMarketPrice;
          }
        }
      } else if (endpoint.name === 'Yahoo v8') {
        if (response.data && 
            response.data.chart && 
            response.data.chart.result && 
            response.data.chart.result.length > 0) {
          
          const result = response.data.chart.result[0];
          
          if (result.meta && result.meta.regularMarketPrice) {
            price = result.meta.regularMarketPrice;
          }
        }
      } else if (endpoint.name === 'Yahoo v10') {
        if (response.data && 
            response.data.quoteSummary && 
            response.data.quoteSummary.result && 
            response.data.quoteSummary.result.length > 0) {
          
          const priceData = response.data.quoteSummary.result[0].price;
          
          if (priceData && priceData.regularMarketPrice && priceData.regularMarketPrice.raw) {
            price = priceData.regularMarketPrice.raw;
          }
        }
      }
      
      if (price !== null) {
        console.log(`Successfully fetched Costco price from ${endpoint.name}: $${price}`);
        return price;
      }
    }
    
    console.error('Failed to fetch Costco price from any endpoint');
    return null;
  } catch (error) {
    console.error('Error fetching Costco price:', error);
    return null;
  }
};

// Function to fetch multiple stock prices in a single request (batch)
export const fetchBatchPrices = async (tickers: string[]): Promise<{[ticker: string]: number}> => {
  console.log(`Attempting to fetch batch prices for ${tickers.length} stocks...`);
  
  const results: {[ticker: string]: number} = {};
  
  if (tickers.length === 0) {
    return results;
  }
  
  try {
    // Join tickers with commas for the API request
    const tickerString = tickers.join(',');
    
    // Using Yahoo Finance batch API
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickerString}`;
    console.log(`Batch API URL: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Check if we have valid data
    if (response.data && 
        response.data.quoteResponse && 
        response.data.quoteResponse.result) {
      
      const quotes = response.data.quoteResponse.result;
      
      // Process each quote
      for (const quote of quotes) {
        if (quote.symbol && quote.regularMarketPrice) {
          results[quote.symbol] = quote.regularMarketPrice;
          console.log(`Successfully fetched batch price for ${quote.symbol}: $${quote.regularMarketPrice}`);
        }
      }
    }
    
    console.log(`Fetched ${Object.keys(results).length} out of ${tickers.length} requested prices`);
    return results;
  } catch (error) {
    console.error('Error fetching batch prices:', error);
    return results;
  }
}; 