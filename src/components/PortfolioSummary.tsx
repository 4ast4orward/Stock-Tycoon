import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedValue } from './AnimatedValue';

interface PortfolioSummaryProps {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  totalValue,
  dailyChange,
  dailyChangePercent
}) => {
  const isPositive = dailyChange >= 0;
  const color = isPositive ? '#4CAF50' : '#F44336';
  const prefix = isPositive ? '+' : '';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Portfolio Value</Text>
      <AnimatedValue
        value={totalValue}
        formatValue={(value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        style={styles.value}
      />
      <View style={styles.changeContainer}>
        <AnimatedValue
          value={dailyChange}
          formatValue={(value) => `${prefix}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          style={[styles.change, { color }]}
        />
        <AnimatedValue
          value={dailyChangePercent}
          formatValue={(value) => `(${prefix}${Math.abs(value).toFixed(2)}%)`}
          style={[styles.percent, { color }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  percent: {
    fontSize: 14,
    opacity: 0.8,
  },
}); 