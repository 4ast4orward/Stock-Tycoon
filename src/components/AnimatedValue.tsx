import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';

interface AnimatedValueProps {
  value: number;
  formatValue?: (value: number) => string;
  style?: any;
  duration?: number;
}

const AnimatedValue: React.FC<AnimatedValueProps> = ({
  value,
  formatValue = (v) => v.toString(),
  style,
  duration = 300
}) => {
  try {
    const [displayValue, setDisplayValue] = useState(value);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
      if (typeof value !== 'number') {
        console.warn('AnimatedValue received non-number value:', value);
        return;
      }

      // Fade out
      setOpacity(0.5);
      
      // Update value after fade out
      setTimeout(() => {
        setDisplayValue(value);
        // Fade in
        setOpacity(1);
      }, duration / 2);
    }, [value, duration]);

    return (
      <Text style={[styles.text, style, { opacity }]}>
        {formatValue(displayValue)}
      </Text>
    );
  } catch (error) {
    console.error('Error in AnimatedValue:', error);
    return <Text style={[styles.text, style]}>Error</Text>;
  }
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default AnimatedValue; 