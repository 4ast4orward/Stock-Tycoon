import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

interface StockChartProps {
  symbol: string;
  price: number;
  previousPrice: number;
  timeframes: string[];
  onTimeframeChange: (timeframe: string) => void;
  showIndicators: boolean;
  onToggleIndicators: () => void;
}

const StockChart: React.FC<StockChartProps> = ({
  symbol,
  price,
  previousPrice,
  timeframes,
  onTimeframeChange,
  showIndicators,
  onToggleIndicators
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState(timeframes[0]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
        strokeWidth: 2
      }
    ]
  });

  // Generate mock data for the chart
  useEffect(() => {
    const generateChartData = () => {
      const isPositive = price >= previousPrice;
      const baseValue = previousPrice;
      const volatility = 0.02; // 2% volatility
      
      const dataPoints = 20;
      const labels = [];
      const data = [];
      
      for (let i = 0; i < dataPoints; i++) {
        // Generate a random price movement
        const randomChange = (Math.random() - 0.5) * volatility * baseValue;
        const newPrice = baseValue + randomChange + (isPositive ? (price - previousPrice) * (i / dataPoints) : 0);
        
        // Format label based on timeframe
        let label = '';
        if (activeTimeframe === '1D') {
          label = `${i * 3}:00`;
        } else if (activeTimeframe === '1W') {
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
          label = days[i % 5];
        } else if (activeTimeframe === '1M') {
          label = `${i + 1}`;
        } else if (activeTimeframe === '1Y') {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          label = months[i % 12];
        }
        
        labels.push(label);
        data.push(newPrice);
      }
      
      setChartData({
        labels,
        datasets: [
          {
            data,
            color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
            strokeWidth: 2
          }
        ]
      });
    };
    
    generateChartData();
  }, [activeTimeframe, price, previousPrice]);

  const handleTimeframeChange = (timeframe: string) => {
    setActiveTimeframe(timeframe);
    onTimeframeChange(timeframe);
  };

  const screenWidth = Dimensions.get('window').width - 40; // Account for padding

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{symbol} Chart</Text>
        <TouchableOpacity onPress={onToggleIndicators} style={styles.indicatorButton}>
          <Ionicons 
            name={showIndicators ? "analytics" : "analytics-outline"} 
            size={24} 
            color={showIndicators ? "#4a90e2" : "#999"} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeframeContainer}>
        {timeframes.map((timeframe) => (
          <TouchableOpacity
            key={timeframe}
            style={[
              styles.timeframeButton,
              activeTimeframe === timeframe && styles.activeTimeframeButton
            ]}
            onPress={() => handleTimeframeChange(timeframe)}
          >
            <Text 
              style={[
                styles.timeframeText,
                activeTimeframe === timeframe && styles.activeTimeframeText
              ]}
            >
              {timeframe}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '0', // Hide dots
          },
          propsForBackgroundLines: {
            strokeDasharray: '', // Solid lines
            strokeWidth: 0.5,
            stroke: 'rgba(0, 0, 0, 0.1)',
          }
        }}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={false}
      />
      
      {showIndicators && (
        <View style={styles.indicatorsContainer}>
          <Text style={styles.indicatorsTitle}>Technical Indicators</Text>
          <View style={styles.indicatorRow}>
            <Text style={styles.indicatorLabel}>RSI (14):</Text>
            <Text style={styles.indicatorValue}>65.4</Text>
          </View>
          <View style={styles.indicatorRow}>
            <Text style={styles.indicatorLabel}>MACD:</Text>
            <Text style={styles.indicatorValue}>+0.23</Text>
          </View>
          <View style={styles.indicatorRow}>
            <Text style={styles.indicatorLabel}>Bollinger Bands:</Text>
            <Text style={styles.indicatorValue}>Upper: ${(price * 1.02).toFixed(2)}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  indicatorButton: {
    padding: 5,
  },
  timeframeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  timeframeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeTimeframeButton: {
    backgroundColor: '#4a90e2',
  },
  timeframeText: {
    fontSize: 14,
    color: '#333',
  },
  activeTimeframeText: {
    color: 'white',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  indicatorsContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  indicatorsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  indicatorLabel: {
    fontSize: 14,
    color: '#666',
  },
  indicatorValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default StockChart; 