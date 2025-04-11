import axios from 'axios';

/**
 * Direct web scraping solution for stock prices using regex instead of JSDOM
 * This is a more lightweight approach that doesn't require additional dependencies
 */

// Function to fetch stock price from CNBC using regex
export const scrapeCNBCStockPrice = async (ticker: string): Promise<number | null> => {
  console.log(`Attempting to extract CNBC price for ${ticker}...`);
  
  try {
    const url = `https://www.cnbc.com/quotes/${ticker}`;
    console.log(`CNBC Extractor URL: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml'
      }
    });
    
    const html = response.data;
    
    // Look for price patterns in the HTML
    // Pattern for CNBC price in JSON data
    const priceRegex = /"last":"(\d+\.\d+)"/;
    const match = html.match(priceRegex);
    
    if (match && match[1]) {
      const price = parseFloat(match[1]);
      if (!isNaN(price)) {
        console.log(`Successfully extracted CNBC price for ${ticker}: $${price}`);
        return price;
      }
    }
    
    // Alternative pattern
    const altPriceRegex = /"last":\s*(\d+\.\d+)/;
    const altMatch = html.match(altPriceRegex);
    
    if (altMatch && altMatch[1]) {
      const price = parseFloat(altMatch[1]);
      if (!isNaN(price)) {
        console.log(`Successfully extracted CNBC price for ${ticker} (alt method): $${price}`);
        return price;
      }
    }
    
    console.error(`Could not extract price for ${ticker} from CNBC`);
    return null;
  } catch (error) {
    console.error(`Error extracting CNBC price for ${ticker}:`, error);
    return null;
  }
};

// Function to fetch stock price from MarketWatch using regex
export const scrapeMarketWatchStockPrice = async (ticker: string): Promise<number | null> => {
  console.log(`Attempting to extract MarketWatch price for ${ticker}...`);
  
  try {
    const url = `https://www.marketwatch.com/investing/stock/${ticker.toLowerCase()}`;
    console.log(`MarketWatch Extractor URL: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml'
      }
    });
    
    const html = response.data;
    
    // Pattern for MarketWatch price
    const priceRegex = /class="value">(\d+\.\d+)</;
    const match = html.match(priceRegex);
    
    if (match && match[1]) {
      const price = parseFloat(match[1]);
      if (!isNaN(price)) {
        console.log(`Successfully extracted MarketWatch price for ${ticker}: $${price}`);
        return price;
      }
    }
    
    // Alternative pattern
    const altPriceRegex = /"price":\s*"(\d+\.\d+)"/;
    const altMatch = html.match(altPriceRegex);
    
    if (altMatch && altMatch[1]) {
      const price = parseFloat(altMatch[1]);
      if (!isNaN(price)) {
        console.log(`Successfully extracted MarketWatch price for ${ticker} (alt method): $${price}`);
        return price;
      }
    }
    
    console.error(`Could not extract price for ${ticker} from MarketWatch`);
    return null;
  } catch (error) {
    console.error(`Error extracting MarketWatch price for ${ticker}:`, error);
    return null;
  }
};

// Function specifically for Costco (COST) stock price using direct extraction
export const scrapeCostcoPrice = async (): Promise<number | null> => {
  console.log('Attempting to extract Costco (COST) price using specialized method...');
  
  try {
    // Try multiple sources for redundancy
    const sources = [
      { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/quote/COST/' },
      { name: 'MarketWatch', url: 'https://www.marketwatch.com/investing/stock/cost' },
      { name: 'CNBC', url: 'https://www.cnbc.com/quotes/COST' }
    ];
    
    for (const source of sources) {
      console.log(`Trying to extract Costco price from ${source.name}: ${source.url}`);
      
      const response = await axios.get(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml'
        }
      });
      
      const html = response.data;
      
      // Different regex patterns for different sources
      let priceMatch = null;
      
      if (source.name === 'Yahoo Finance') {
        // Yahoo Finance patterns
        const yahooRegex = /"regularMarketPrice":{"raw":(\d+\.\d+)/;
        priceMatch = html.match(yahooRegex);
        
        if (!priceMatch) {
          const altYahooRegex = /"COST".*?"regularMarketPrice".*?:.*?(\d+\.\d+)/;
          priceMatch = html.match(altYahooRegex);
        }
      } else if (source.name === 'MarketWatch') {
        // MarketWatch patterns
        const marketWatchRegex = /class="value">(\d+\.\d+)</;
        priceMatch = html.match(marketWatchRegex);
        
        if (!priceMatch) {
          const altMarketWatchRegex = /"price":\s*"(\d+\.\d+)"/;
          priceMatch = html.match(altMarketWatchRegex);
        }
      } else if (source.name === 'CNBC') {
        // CNBC patterns
        const cnbcRegex = /"last":"(\d+\.\d+)"/;
        priceMatch = html.match(cnbcRegex);
        
        if (!priceMatch) {
          const altCnbcRegex = /"last":\s*(\d+\.\d+)/;
          priceMatch = html.match(altCnbcRegex);
        }
      }
      
      if (priceMatch && priceMatch[1]) {
        const price = parseFloat(priceMatch[1]);
        if (!isNaN(price)) {
          console.log(`Successfully extracted Costco price from ${source.name}: $${price}`);
          return price;
        }
      }
    }
    
    console.error('Failed to extract Costco price from any source');
    return null;
  } catch (error) {
    console.error('Error extracting Costco price:', error);
    return null;
  }
};

// Direct HTML extraction from Yahoo Finance
export const extractYahooFinancePrice = async (ticker: string): Promise<number | null> => {
  console.log(`Attempting to extract Yahoo Finance price for ${ticker}...`);
  
  try {
    const url = `https://finance.yahoo.com/quote/${ticker}`;
    console.log(`Yahoo Finance Extractor URL: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Look for price pattern in the HTML
    const html = response.data;
    
    // Pattern to find the regularMarketPrice in the HTML
    const priceRegex = new RegExp(`"${ticker}".*?"regularMarketPrice".*?:.*?(\\d+\\.\\d+)`, 'i');
    const match = html.match(priceRegex);
    
    if (match && match[1]) {
      const price = parseFloat(match[1]);
      if (!isNaN(price)) {
        console.log(`Successfully extracted Yahoo Finance price for ${ticker}: $${price}`);
        return price;
      }
    }
    
    // Alternative pattern
    const altRegex = /"regularMarketPrice":{"raw":(\d+\.\d+)/;
    const altMatch = html.match(altRegex);
    
    if (altMatch && altMatch[1]) {
      const price = parseFloat(altMatch[1]);
      if (!isNaN(price)) {
        console.log(`Successfully extracted Yahoo Finance price for ${ticker} (alt method): $${price}`);
        return price;
      }
    }
    
    console.error(`Could not extract price for ${ticker} from Yahoo Finance`);
    return null;
  } catch (error) {
    console.error(`Error extracting Yahoo Finance price for ${ticker}:`, error);
    return null;
  }
};

// Direct API call for Costco using a reliable public API
export const fetchCostcoDirectAPI = async (): Promise<number | null> => {
  console.log('Attempting to fetch Costco price using direct API call...');
  
  try {
    // Using a public API endpoint that doesn't require authentication
    const url = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=COST';
    console.log(`Costco Direct API URL: ${url}`);
    
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
        console.log(`Successfully fetched Costco price using direct API: $${price}`);
        return price;
      }
    }
    
    console.error('Invalid response format from Costco direct API');
    return null;
  } catch (error) {
    console.error('Error fetching Costco price using direct API:', error);
    return null;
  }
}; 