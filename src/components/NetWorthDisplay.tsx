import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NetWorthDisplayProps } from '../types';

const NetWorthDisplay: React.FC<NetWorthDisplayProps> = ({
  cash,
  portfolioValue,
  income,
  expenses,
  history = [],
  netWorth,
  dailyChange,
  dailyChangePercent,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  const cashPercentage = (cash / netWorth * 100) || 0;
  const portfolioPercentage = (portfolioValue / netWorth * 100) || 0;
  
  // Calculate monthly change
  const monthlyChange = income - expenses;
  const isPositiveChange = monthlyChange >= 0;

  // Calculate net worth change if history is provided
  const netWorthChange = history.length >= 2 
    ? netWorth - history[history.length - 2].netWorth 
    : 0;
  const netWorthChangePercent = history.length >= 2 
    ? (netWorthChange / history[history.length - 2].netWorth * 100) 
    : 0;
  const isPositiveNetWorthChange = netWorthChange >= 0;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: Platform.OS === 'web' ? false : true,
    }).start();
  }, [expanded]);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.summaryContainer}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.mainInfoContainer}>
          <View>
            <Text style={styles.label}>Net Worth</Text>
            <Text style={styles.netWorthValue}>${netWorth.toLocaleString()}</Text>
            
            {history.length >= 2 && (
              <Text style={[
                styles.change, 
                isPositiveNetWorthChange ? styles.positive : styles.negative
              ]}>
                {isPositiveNetWorthChange ? '↑' : '↓'} ${Math.abs(netWorthChange).toLocaleString()} 
                ({isPositiveNetWorthChange ? '+' : ''}
                {netWorthChangePercent.toFixed(2)}%)
              </Text>
            )}
          </View>
          
          <View style={styles.iconContainer}>
            <MaterialIcons 
              name={expanded ? "expand-less" : "expand-more"} 
              size={24} 
              color="#555"
            />
          </View>
        </View>
        
        <View style={styles.distributionBar}>
          <View 
            style={[
              styles.cashPortion, 
              { width: `${cashPercentage}%` }
            ]} 
          />
          <View 
            style={[
              styles.portfolioPortion, 
              { width: `${portfolioPercentage}%` }
            ]} 
          />
        </View>
        
        <View style={styles.distributionLabels}>
          <View style={styles.distributionLabelContainer}>
            <View style={styles.cashIndicator} />
            <Text style={styles.distributionLabel}>
              Cash (${cash.toLocaleString()})
            </Text>
          </View>
          <View style={styles.distributionLabelContainer}>
            <View style={styles.portfolioIndicator} />
            <Text style={styles.distributionLabel}>
              Portfolio (${portfolioValue.toLocaleString()})
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <Animated.View 
        style={[
          styles.detailsContainer,
          { 
            opacity: fadeAnim,
            height: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 110],
            }),
          },
        ]}
      >
        <View style={styles.divider} />
        
        <View style={styles.cashFlowContainer}>
          <Text style={styles.sectionTitle}>Monthly Cash Flow</Text>
          <View style={styles.cashFlowRow}>
            <View style={styles.cashFlowItem}>
              <Text style={styles.cashFlowLabel}>Income</Text>
              <Text style={[styles.cashFlowValue, styles.positive]}>
                +${income.toLocaleString()}
              </Text>
            </View>
            <View style={styles.cashFlowItem}>
              <Text style={styles.cashFlowLabel}>Expenses</Text>
              <Text style={[styles.cashFlowValue, styles.negative]}>
                -${expenses.toLocaleString()}
              </Text>
            </View>
            <View style={styles.cashFlowItem}>
              <Text style={styles.cashFlowLabel}>Net</Text>
              <Text style={[
                styles.cashFlowValue, 
                isPositiveChange ? styles.positive : styles.negative
              ]}>
                {isPositiveChange ? '+' : ''}${monthlyChange.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  summaryContainer: {
    width: '100%',
  },
  mainInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  netWorthValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  change: {
    fontSize: 14,
    fontWeight: '500',
  },
  iconContainer: {
    padding: 5,
  },
  distributionBar: {
    height: 12,
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  cashPortion: {
    height: '100%',
    backgroundColor: '#64B5F6', // Light blue for cash
  },
  portfolioPortion: {
    height: '100%',
    backgroundColor: '#7986CB', // Purple for portfolio
  },
  distributionLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  distributionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cashIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#64B5F6',
    marginRight: 5,
  },
  portfolioIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7986CB',
    marginRight: 5,
  },
  distributionLabel: {
    fontSize: 12,
    color: '#555',
  },
  detailsContainer: {
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  cashFlowContainer: {
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cashFlowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cashFlowItem: {
    flex: 1,
    alignItems: 'center',
  },
  cashFlowLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  cashFlowValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  positive: {
    color: '#4CAF50', // Green
  },
  negative: {
    color: '#F44336', // Red
  },
});

export default NetWorthDisplay; 