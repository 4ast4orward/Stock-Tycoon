import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

export interface MarketIndicesProps {
  indices: {
    name: string;
    value: number;
    change: number;
    changePercent: number;
  }[];
  isLoading: boolean;
  onRefresh: () => void;
}

const MarketIndices: React.FC<MarketIndicesProps> = ({ indices, isLoading, onRefresh }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Market Indices</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="small" color="#4a90e2" />
      ) : (
        <View style={styles.indicesContainer}>
          {indices.map((index, i) => (
            <View key={i} style={styles.indexItem}>
              <Text style={styles.indexName}>{index.name}</Text>
              <Text style={styles.indexValue}>{index.value.toFixed(2)}</Text>
              <Text style={[
                styles.indexChange,
                { color: index.change >= 0 ? '#4CAF50' : '#f44336' }
              ]}>
                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 5,
  },
  refreshText: {
    color: '#4a90e2',
  },
  indicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  indexItem: {
    width: '48%',
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  indexName: {
    fontSize: 14,
    fontWeight: '500',
  },
  indexValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  indexChange: {
    fontSize: 14,
  },
});

export default MarketIndices; 