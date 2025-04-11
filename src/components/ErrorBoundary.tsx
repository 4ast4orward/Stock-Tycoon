import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to your error reporting service
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ScrollView style={styles.errorContainer}>
          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            
            {this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorMessage}>
                  {this.state.error.message || 'An unexpected error occurred'}
                </Text>
                
                {__DEV__ && this.state.errorInfo && (
                  <View style={styles.stackTrace}>
                    <Text style={styles.stackTraceTitle}>Component Stack:</Text>
                    <Text style={styles.stackTraceText}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={this.handleReset}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.resetButton, styles.reportButton]}
              onPress={() => {
                // Implement error reporting logic here
                console.log('Report error:', this.state.error);
              }}
            >
              <Text style={styles.buttonText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorDetails: {
    width: '100%',
    marginBottom: 20,
  },
  errorMessage: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  stackTrace: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  stackTraceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 5,
  },
  stackTraceText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  resetButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    marginVertical: 5,
  },
  reportButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorBoundary; 