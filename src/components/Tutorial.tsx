import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Dimensions,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TutorialProps } from '../types';

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  tip?: string;
  image?: string; // In a real app, this would be an image path
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Welcome to Stock Tycoon!',
    content: 'Stock Tycoon is a stock market simulation game where you can practice investing without risking real money. This tutorial will guide you through the basics of the app.',
    tip: 'You can access this tutorial again from the settings menu at any time.'
  },
  {
    id: 2,
    title: 'Browsing Stocks',
    content: 'The main screen shows a list of available stocks. You can browse, search, and sort them to find investment opportunities. Tap on any stock to view more details about the company.',
    tip: 'Use the search bar to quickly find specific companies or industries.'
  },
  {
    id: 3,
    title: 'Buying Stocks',
    content: 'To buy a stock, tap on it and press the "Buy" button. Enter the number of shares you want to purchase and confirm your transaction. The cost will be deducted from your available cash.',
    tip: 'Start with small investments to diversify your portfolio and reduce risk.'
  },
  {
    id: 4,
    title: 'Managing Your Portfolio',
    content: 'Your portfolio section shows all the stocks you own. You can see their current value, performance, and percentage of your total investments. To sell a stock, tap on it in your portfolio and select "Sell".',
    tip: 'Regularly review your portfolio to ensure it aligns with your investment strategy.'
  },
  {
    id: 5,
    title: 'Tracking Performance',
    content: 'The app tracks your performance over time. You can view charts of your portfolio growth, transaction history, and comparison with market indices to evaluate your investment decisions.',
    tip: 'Successful investing requires patience and a long-term perspective.'
  }
];

const { width } = Dimensions.get('window');

const Tutorial: React.FC<TutorialProps> = ({
  visible,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: Platform.OS === 'ios',
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: Platform.OS === 'ios',
      }).start();
    }
  }, [visible]);
  
  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const stepIndex = Math.round(value / width);
      if (stepIndex !== currentStep) {
        setCurrentStep(stepIndex);
      }
    });
    
    return () => scrollX.removeListener(listener);
  }, [scrollX, currentStep]);
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      scrollViewRef.current?.scrollTo({ x: nextStep * width, animated: true });
    } else {
      onClose();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      scrollViewRef.current?.scrollTo({ x: prevStep * width, animated: true });
    }
  };
  
  const handleSkip = () => {
    onClose();
  };

  if (!visible) return null;
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Tutorial</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>
          
          <Animated.ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            style={styles.scrollView}
          >
            {tutorialSteps.map((step) => (
              <View key={step.id} style={[styles.stepContainer, { width }]}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepContent}>{step.content}</Text>
                
                {step.tip && (
                  <View style={styles.tipContainer}>
                    <MaterialIcons name="lightbulb" size={20} color="#FFC107" />
                    <Text style={styles.tipText}>{step.tip}</Text>
                  </View>
                )}
                
                {/* Placeholder for images */}
                <View style={styles.imagePlaceholder}>
                  <MaterialIcons name="image" size={40} color="#ddd" />
                  <Text style={styles.imagePlaceholderText}>Tutorial Image</Text>
                </View>
              </View>
            ))}
          </Animated.ScrollView>
          
          <View style={styles.pagination}>
            {tutorialSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentStep === index && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
          
          <View style={styles.buttonsContainer}>
            {currentStep > 0 ? (
              <TouchableOpacity onPress={handlePrevious} style={styles.button}>
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleSkip} style={styles.button}>
                <Text style={styles.buttonText}>Skip</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              onPress={handleNext} 
              style={[styles.button, styles.primaryButton]}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Got it!'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  stepContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  tipText: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
    color: '#555',
  },
  imagePlaceholder: {
    height: 180,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: '#999',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#4285F4',
    width: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  buttonText: {
    fontSize: 16,
    color: '#555',
  },
  primaryButton: {
    backgroundColor: '#4285F4',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Tutorial; 