import { Share } from 'react-native';

const sharePortfolio = async (portfolioValue) => {
  try {
    await Share.share({
      message: `Check out my stock portfolio! Current value: $${portfolioValue.toFixed(2)}`,
      title: 'My Stock Portfolio'
    });
  } catch (error) {
    console.error('Error sharing:', error);
  }
}; 