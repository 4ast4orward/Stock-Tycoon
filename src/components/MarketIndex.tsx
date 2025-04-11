import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedValue } from './AnimatedValue';

interface MarketIndexProps {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export const MarketIndex: React.FC<MarketIndexProps> = ({
  name,
  value,
  change,
  changePercent
}) => {
  const isPositive = change >= 0;
  const color = isPositive ? '#4CAF50' : '#F44336';
  const prefix = isPositive ? '+' : '';

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <AnimatedValue
        value={value}
        formatValue={(value) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        style={styles.value}
      />
      <View style={styles.changeContainer}>
        <AnimatedValue
          value={change}
          formatValue={(value) => `${prefix}${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          style={[styles.change, { color }]}
        />
        <AnimatedValue
          value={changePercent}
          formatValue={(value) => `(${prefix}${Math.abs(value).toFixed(2)}%)`}
          style={[styles.percent, { color }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  percent: {
    fontSize: 12,
    opacity: 0.8,
  },
}); 