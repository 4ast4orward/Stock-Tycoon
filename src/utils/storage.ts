import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserPreferences = async (preferences) => {
  try {
    await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
};

export const loadUserPreferences = async () => {
  try {
    const preferences = await AsyncStorage.getItem('userPreferences');
    return preferences ? JSON.parse(preferences) : null;
  } catch (error) {
    console.error('Error loading preferences:', error);
    return null;
  }
}; 