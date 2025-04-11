import axios from 'axios';

// Function to fetch real-time stock data using a reliable public API
export const fetchMarketDataPrice = async (ticker: string): Promise<number | null> => {
  console.log(`Attempting to fetch MarketData price for ${ticker}...`);
  
  try {
    // Using Yahoo Finance API directly (no API key required)
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
    console.log(`MarketData API Request URL: ${url}`);
    
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
      
      // Get the most recent price
      if (result.meta && result.meta.regularMarketPrice) {
        const price = result.meta.regularMarketPrice;
        console.log(`Successfully fetched MarketData price for ${ticker}: $${price}`);
        return price;
      }
    }
    
    console.error('Invalid MarketData response format:', JSON.stringify(response.data).substring(0, 300) + '...');
    return null;
  } catch (error) {
    console.error(`Error fetching MarketData price for ${ticker}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
    }
    return null;
  }
};

// Alternative method using a different endpoint
export const fetchMarketDataPriceAlternative = async (ticker: string): Promise<number | null> => {
  console.log(`Attempting to fetch MarketData price for ${ticker} using alternative method...`);
  
  try {
    // Using a different endpoint
    const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price`;
    console.log(`MarketData Alternative API Request URL: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Check if we have valid data
    if (response.data && 
        response.data.quoteSummary && 
        response.data.quoteSummary.result && 
        response.data.quoteSummary.result.length > 0) {
      
      const priceData = response.data.quoteSummary.result[0].price;
      
      if (priceData && priceData.regularMarketPrice) {
        const price = priceData.regularMarketPrice.raw;
        console.log(`Successfully fetched MarketData price for ${ticker} using alternative method: $${price}`);
        return price;
      }
    }
    
    console.error('Invalid MarketData alternative response format:', JSON.stringify(response.data).substring(0, 300) + '...');
    return null;
  } catch (error) {
    console.error(`Error fetching MarketData price for ${ticker} using alternative method:`, error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
    }
    return null;
  }
};

// Function specifically for Costco (COST) stock price
export const fetchCostcoPrice = async (): Promise<number | null> => {
  console.log('Attempting to fetch Costco (COST) price using specialized method...');
  
  try {
    // Using a more direct approach for Costco
    const url = 'https://query2.finance.yahoo.com/v10/finance/quoteSummary/COST?modules=price,summaryDetail';
    console.log(`Costco API Request URL: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Check if we have valid data
    if (response.data && 
        response.data.quoteSummary && 
        response.data.quoteSummary.result && 
        response.data.quoteSummary.result.length > 0) {
      
      const priceData = response.data.quoteSummary.result[0].price;
      
      if (priceData && priceData.regularMarketPrice) {
        const price = priceData.regularMarketPrice.raw;
        console.log(`Successfully fetched Costco price: $${price}`);
        return price;
      }
    }
    
    console.error('Invalid Costco response format:', JSON.stringify(response.data).substring(0, 300) + '...');
    return null;
  } catch (error) {
    console.error('Error fetching Costco price:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
    }
    return null;
  }
}; 