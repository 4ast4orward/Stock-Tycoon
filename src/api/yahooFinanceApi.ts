import axios from 'axios';

// Function to fetch real-time stock data for a single ticker using Yahoo Finance
export const fetchYahooStockPrice = async (ticker: string): Promise<number | null> => {
  console.log(`Attempting to fetch Yahoo Finance price for ${ticker}...`);
  
  try {
    // Yahoo Finance API endpoint
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d`;
    console.log(`Yahoo Finance API Request URL: ${url}`);
    
    const response = await axios.get(url);
    
    // Check if we have valid data
    if (response.data && 
        response.data.chart && 
        response.data.chart.result && 
        response.data.chart.result.length > 0) {
      
      const result = response.data.chart.result[0];
      
      // Get the most recent price (regular market price)
      if (result.meta && result.meta.regularMarketPrice) {
        const price = result.meta.regularMarketPrice;
        console.log(`Successfully fetched Yahoo Finance price for ${ticker}: $${price}`);
        return price;
      }
    }
    
    console.error('Invalid Yahoo Finance response format:', JSON.stringify(response.data).substring(0, 300) + '...');
    return null;
  } catch (error) {
    console.error(`Error fetching Yahoo Finance price for ${ticker}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
    }
    return null;
  }
};

// Function to fetch batch stock data (for multiple tickers)
export const fetchBatchYahooStockPrices = async (tickers: string[]): Promise<Record<string, number>> => {
  const results: Record<string, number> = {};
  
  console.log(`Attempting to fetch Yahoo Finance prices for ${tickers.length} stocks: ${tickers.join(', ')}`);
  
  // Process tickers one by one
  for (const ticker of tickers) {
    const price = await fetchYahooStockPrice(ticker);
    
    if (price !== null) {
      results[ticker] = price;
    }
    
    // Add a small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`Fetched ${Object.keys(results).length} out of ${tickers.length} Yahoo Finance stock prices`);
  return results;
}; 