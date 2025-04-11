# Stock Tycoon

A stock market simulation game where you can buy and sell stocks to build your portfolio.

## New Feature: Real Stock Market Data

The game now supports real stock market data using the Alpha Vantage API. This allows you to see actual stock prices for companies in the game.

### Setup Instructions

1. **Get an API Key**:
   - Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key) to get your free API key
   - Sign up for a free account to receive your API key

2. **Configure the API Key**:
   - Open the file `src/config/apiConfig.ts`
   - Replace `'YOUR_API_KEY'` with your actual Alpha Vantage API key:
     ```typescript
     API_KEY: 'YOUR_ACTUAL_KEY_HERE',
     ```

3. **Adjust Settings (Optional)**:
   - In the same file, you can modify these settings:
     - `USE_REAL_DATA`: Set to `true` to use real data or `false` to use only simulated data
     - `COMPANIES_TO_FETCH`: Number of companies to fetch real data for (default: 5)
     - `REFRESH_INTERVAL_MS`: How often to refresh real data (default: 1 hour)

### API Limitations

The free tier of Alpha Vantage has the following limitations:
- 5 API calls per minute
- 500 API calls per day

To work within these limitations, the game:
- Only fetches real data for the first 5 companies by default
- Adds a 12-second delay between API calls
- Uses simulated data for the remaining companies
- Refreshes real data once per hour

### Troubleshooting

If you encounter issues with the API:
1. Check that your API key is entered correctly
2. Verify your internet connection
3. If you see "Invalid response format" errors, the API may be rate-limiting your requests
4. You can set `USE_REAL_DATA` to `false` to fall back to simulated data

## Running the Game

```bash
npm install
npm start
```

Then follow the Expo instructions to run on your device or emulator.

## Features

- Buy and sell stocks
- Real-time price simulation
- Portfolio tracking
- Income and expenses simulation
- Real stock market data integration 