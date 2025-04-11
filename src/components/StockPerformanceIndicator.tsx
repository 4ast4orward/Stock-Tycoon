import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnimatedValue from './AnimatedValue';

interface StockPerformanceIndicatorProps {
  change: number;
  changePercent: number;
}

const StockPerformanceIndicator: React.FC<StockPerformanceIndicatorProps> = ({
  change,
  changePercent
}) => {
  try {
    // Ensure both values are numbers
    if (typeof change !== 'number' || typeof changePercent !== 'number') {
      console.warn('StockPerformanceIndicator received non-number values:', { change, changePercent });
      return null;
    }

    const isPositive = change >= 0;
    const color = isPositive ? '#4CAF50' : '#F44336';
    const prefix = isPositive ? '+' : '';

    return (
      <View style={styles.container}>
        <AnimatedValue
          value={change}
          formatValue={(value) => `${prefix}$${Math.abs(value).toFixed(2)}`}
          style={[styles.change, { color }]}
          duration={300}
        />
        <AnimatedValue
          value={changePercent}
          formatValue={(value) => `(${prefix}${Math.abs(value).toFixed(2)}%)`}
          style={[styles.percent, { color }]}
          duration={300}
        />
      </View>
    );
  } catch (error) {
    console.error('Error in StockPerformanceIndicator:', error);
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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

export default StockPerformanceIndicator; 