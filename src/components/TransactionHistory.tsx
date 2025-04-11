import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  ticker: string;
  companyName: string;
  shares: number;
  price: number;
  total: number;
  timestamp: Date;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isBuy = item.type === 'buy';
    
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionHeader}>
          <Text style={styles.timestamp}>{item.timestamp.toLocaleString()}</Text>
          <Text style={[styles.transactionType, isBuy ? styles.buyType : styles.sellType]}>
            {isBuy ? 'BUY' : 'SELL'}
          </Text>
        </View>
        
        <Text style={styles.ticker}>{item.ticker} - {item.companyName}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.details}>Shares: {item.shares}</Text>
          <Text style={styles.details}>Price: ${item.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.total}>Total: ${item.total.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {transactions.length === 0 ? (
        <Text style={styles.noTransactions}>No transactions yet</Text>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    width: '100%',
    maxHeight: 300,
  },
  transactionItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  transactionType: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  buyType: {
    color: '#4CAF50',
  },
  sellType: {
    color: '#F44336',
  },
  ticker: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
  },
  total: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  noTransactions: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
});

export default TransactionHistory; 