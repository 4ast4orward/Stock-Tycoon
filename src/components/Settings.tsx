import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsProps {
  visible: boolean;
  onClose: () => void;
  onSaveGame: () => void;
  onLoadGame: () => void;
  onShowTutorial: () => void;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  showAnimations: boolean;
  showMarketIndices: boolean;
  showNewsFeed: boolean;
}

const Settings: React.FC<SettingsProps> = ({
  visible,
  onClose,
  onSaveGame,
  onLoadGame,
  onShowTutorial
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 5,
    showAnimations: true,
    showMarketIndices: true,
    showNewsFeed: true
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedPreferences = await AsyncStorage.getItem('userPreferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async (newPreferences: UserPreferences) => {
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences');
    }
  };

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    savePreferences(newPreferences);
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Game Controls Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Controls</Text>
          <TouchableOpacity style={styles.button} onPress={onSaveGame}>
            <Text style={styles.buttonText}>Save Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onLoadGame}>
            <Text style={styles.buttonText}>Load Game</Text>
          </TouchableOpacity>
        </View>

        {/* Display Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Theme</Text>
            <View style={styles.themeButtons}>
              <TouchableOpacity 
                style={[styles.themeButton, preferences.theme === 'light' && styles.activeThemeButton]}
                onPress={() => handlePreferenceChange('theme', 'light')}
              >
                <Text style={styles.themeButtonText}>Light</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.themeButton, preferences.theme === 'dark' && styles.activeThemeButton]}
                onPress={() => handlePreferenceChange('theme', 'dark')}
              >
                <Text style={styles.themeButtonText}>Dark</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Show Animations</Text>
            <Switch
              value={preferences.showAnimations}
              onValueChange={(value) => handlePreferenceChange('showAnimations', value)}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Show Market Indices</Text>
            <Switch
              value={preferences.showMarketIndices}
              onValueChange={(value) => handlePreferenceChange('showMarketIndices', value)}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Show News Feed</Text>
            <Switch
              value={preferences.showNewsFeed}
              onValueChange={(value) => handlePreferenceChange('showNewsFeed', value)}
            />
          </View>
        </View>

        {/* Data Refresh Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Refresh Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Auto Refresh</Text>
            <Switch
              value={preferences.autoRefresh}
              onValueChange={(value) => handlePreferenceChange('autoRefresh', value)}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Refresh Interval (minutes)</Text>
            <View style={styles.intervalButtons}>
              {[1, 5, 15, 30].map((interval) => (
                <TouchableOpacity
                  key={interval}
                  style={[styles.intervalButton, preferences.refreshInterval === interval && styles.activeIntervalButton]}
                  onPress={() => handlePreferenceChange('refreshInterval', interval)}
                >
                  <Text style={styles.intervalButtonText}>{interval}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Switch
              value={preferences.notifications}
              onValueChange={(value) => handlePreferenceChange('notifications', value)}
            />
          </View>
        </View>

        {/* Tutorial Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tutorial</Text>
          <TouchableOpacity style={styles.button} onPress={onShowTutorial}>
            <Text style={styles.buttonText}>Show Tutorial</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Stock Tycoon is a stock market simulation game where you can practice investing without risking real money.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  themeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeThemeButton: {
    backgroundColor: '#4a90e2',
  },
  themeButtonText: {
    fontSize: 14,
    color: '#333',
  },
  intervalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  intervalButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeIntervalButton: {
    backgroundColor: '#4a90e2',
  },
  intervalButtonText: {
    fontSize: 14,
    color: '#333',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});

export default Settings; 