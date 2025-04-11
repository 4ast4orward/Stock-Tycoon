import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { VictoryPie, VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';

import { RootState } from '../state/store';
import financialEngine from '../engines/financialEngine';

const DashboardScreen = ({ navigation }) => {
  // Super simple data with no arrays or complex properties
  const cash = 1250;
  const income = 3000;
  const expenses = 2100;
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Financial Dashboard</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Balance</Text>
        <Text style={styles.amount}>${cash.toFixed(2)}</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Income</Text>
        <Text style={styles.amount}>${income.toFixed(2)}</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Expenses</Text>
        <Text style={styles.amount}>${expenses.toFixed(2)}</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Cash Flow</Text>
        <Text style={[
          styles.amount, 
          (income - expenses) >= 0 ? styles.positive : styles.negative
        ]}>
          ${(income - expenses).toFixed(2)}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen; 