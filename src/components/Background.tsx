import React from 'react';
import { ImageBackground, StyleSheet, View, Dimensions } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Add debugging to help locate the image
let backgroundImage;
try {
  console.log('Attempting to load background image...');
  // Try different relative paths to help debug
  backgroundImage = require('../../assets/images/city1.jpg');
  console.log('Successfully loaded background image');
} catch (e) {
  console.warn('Failed to load background image:', e.message);
  // Try alternative paths if the first one fails
  try {
    console.log('Trying alternative path...');
    backgroundImage = require('../../../assets/images/city1.jpg');
    console.log('Successfully loaded background image from alternative path');
  } catch (e2) {
    console.warn('Failed to load from alternative path:', e2.message);
  }
}

export const Background = ({ children }) => {
  if (!backgroundImage) {
    console.warn('No background image available, using fallback');
    return (
      <View style={[styles.container, styles.fallbackBackground]}>
        {children}
      </View>
    );
  }

  return (
    <ImageBackground 
      source={backgroundImage}
      style={styles.container}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
      onError={(e) => console.error('Error loading background:', e.nativeEvent.error)}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  fallbackBackground: {
    backgroundColor: '#f0f0f0',
  }
}); 