import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Animated, Platform } from 'react-native';
import { Dimensions } from 'react-native';
import StockChart from './StockChart';
import { Stock } from '../types';

const screenWidth = Dimensions.get('window').width - 40;

export interface StockDetailsProps {
  isVisible: boolean;
  stock: Stock | null;
  onClose: () => void;
  onBuy: () => void;
  historicalData?: { date: string; price: number }[];
}

// Generate random historical data if none provided
const generateMockHistoricalData = (currentPrice: number, days: number = 30) => {
  const data = [];
  let price = currentPrice * 0.85; // Start a bit lower than current price
  
  for (let i = days; i > 0; i--) {
    // Create a date days ago
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some randomness to the price (up to 2% change per day)
    const change = (Math.random() - 0.4) * price * 0.02; // Slight upward bias
    price += change;
    
    data.push({
      date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      price: Number(price.toFixed(2))
    });
  }
  
  // Ensure the last data point is the current price
  if (data.length > 0) {
    data[data.length - 1].price = currentPrice;
  }
  
  return data;
};

const StockDetails: React.FC<StockDetailsProps> = ({
  isVisible,
  stock,
  onClose,
  onBuy,
  historicalData,
}) => {
  if (!stock) return null;

  // Use provided historical data or generate mock data
  const chartData = historicalData || generateMockHistoricalData(stock.price);
  
  // Calculate change if not provided
  const priceChange = stock.previousPrice 
    ? stock.price - stock.previousPrice 
    : 0;
  const priceChangePercent = stock.previousPrice 
    ? ((stock.price - stock.previousPrice) / stock.previousPrice) * 100 
    : 0;
  
  // Determine if stock is up or down
  const isUp = priceChange >= 0;
  
  const [modalAnimation] = useState(new Animated.Value(0));
  const [showIndicators, setShowIndicators] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState('1D');

  useEffect(() => {
    if (isVisible) {
      Animated.spring(modalAnimation, {
        toValue: 1,
        useNativeDriver: Platform.OS === 'ios',
        friction: 8,
      }).start();
    } else {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: Platform.OS === 'ios',
      }).start();
    }
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.modalContainer,
          {
            opacity: modalAnimation,
            transform: [
              {
                scale: modalAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.companyName}>{stock.name}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.priceContainer}>
              <Text style={styles.ticker}>{stock.symbol}</Text>
              <Text style={styles.price}>${stock.price.toFixed(2)}</Text>
              <Text style={[styles.priceChange, { color: isUp ? '#4CAF50' : '#f44336' }]}>
                {isUp ? '+' : ''}{priceChange.toFixed(2)} ({isUp ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </Text>
            </View>
            
            <View style={styles.chartContainer}>
              <StockChart
                symbol={stock.symbol}
                price={stock.price}
                previousPrice={stock.previousPrice}
                timeframes={['1D', '1W', '1M', '3M', '1Y']}
                onTimeframeChange={setActiveTimeframe}
                showIndicators={showIndicators}
                onToggleIndicators={() => setShowIndicators(!showIndicators)}
              />
            </View>
            
            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>Key Statistics</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Previous Close</Text>
                  <Text style={styles.statValue}>${stock.previousPrice?.toFixed(2) || 'N/A'}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Open</Text>
                  <Text style={styles.statValue}>${stock.price?.toFixed(2) || 'N/A'}</Text>
                </View>
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Day High</Text>
                  <Text style={styles.statValue}>${stock.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Day Low</Text>
                  <Text style={styles.statValue}>${stock.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}</Text>
                </View>
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Volume</Text>
                  <Text style={styles.statValue}>{stock.volume?.toLocaleString() || 'N/A'}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Market Cap</Text>
                  <Text style={styles.statValue}>
                    {stock.marketCap ? `$${(stock.marketCap / 1000000000).toFixed(2)}B` : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.aboutContainer}>
              <Text style={styles.sectionTitle}>About {stock.name}</Text>
              <Text style={styles.description}>
                {stock.description || 
                  `${stock.name} (${stock.symbol}) is a publicly traded company. ` +
                  `This is a placeholder description. In a real app, this would contain the company's profile, ` +
                  `business details, and recent developments.`}
              </Text>
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.buyButton} onPress={onBuy}>
            <Text style={styles.buyButtonText}>Buy {stock.symbol}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  scrollView: {
    maxHeight: '80%',
  },
  priceContainer: {
    marginBottom: 20,
  },
  ticker: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  priceChange: {
    fontSize: 16,
    fontWeight: '500',
  },
  chartContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  statsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: '#666',
    fontSize: 14,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  aboutContainer: {
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  buyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StockDetails; 