import analytics from '@react-native-firebase/analytics';

export const logStockPurchase = async (stockTicker, price, shares) => {
  await analytics().logEvent('stock_purchase', {
    ticker: stockTicker,
    price: price,
    shares: shares,
    total_value: price * shares,
  });
}; 