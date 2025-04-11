import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StockHolding, Portfolio } from '../types';

interface PortfolioManagerProps {
  portfolio: Portfolio;
  onBuyStock: (symbol: string) => void;
  onSellStock: (symbol: string) => void;
}

const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  portfolio = {},
  onBuyStock,
  onSellStock,
}) => {
  const portfolioStocks = Object.values(portfolio || {});
  const totalValue = portfolioStocks.reduce(
    (sum, stock) => sum + (stock?.shares || 0) * (stock?.price || 0),
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfolio</Text>
      <Text style={styles.totalValue}>Total Value: ${totalValue.toFixed(2)}</Text>
      
      <ScrollView style={styles.stockList}>
        {portfolioStocks.map((stock) => (
          <View key={stock.symbol} style={styles.stockItem}>
            <View style={styles.stockInfo}>
              <Text style={styles.stockName}>{stock.name}</Text>
              <Text style={styles.stockSymbol}>{stock.symbol}</Text>
              <Text style={styles.stockShares}>Shares: {stock.shares}</Text>
              <Text style={styles.stockPrice}>
                Current Price: ${stock.price.toFixed(2)}
              </Text>
              <Text style={styles.stockValue}>
                Value: ${((stock.shares || 0) * (stock.price || 0)).toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buyButton]}
                onPress={() => onBuyStock(stock.symbol)}
              >
                <Text style={styles.buttonText}>Buy More</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.sellButton]}
                onPress={() => onSellStock(stock.symbol)}
              >
                <Text style={styles.buttonText}>Sell</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#666',
  },
  stockList: {
    flex: 1,
  },
  stockItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  stockInfo: {
    marginBottom: 12,
  },
  stockName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  stockSymbol: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  stockShares: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stockPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buyButton: {
    backgroundColor: '#28a745',
  },
  sellButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default PortfolioManager; 