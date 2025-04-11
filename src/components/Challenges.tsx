import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
  type: 'daily' | 'weekly' | 'achievement';
}

interface UserProgress {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  completedChallenges: string[];
  achievements: string[];
}

interface ChallengesProps {
  visible: boolean;
  onClose: () => void;
  onCompleteChallenge: (challengeId: string, reward: number) => void;
  cash: number;
  setCash: (cash: number) => void;
  gameState?: {
    portfolioValue?: number;
    profitableTrades?: number;
    portfolioSectors?: string[];
    tradesToday?: number;
    largestTrade?: number;
    highestProfitPercent?: number;
    longestHoldingDays?: number;
  };
}

const Challenges: React.FC<ChallengesProps> = ({
  visible,
  onClose,
  onCompleteChallenge,
  cash,
  setCash,
  gameState = {}
}) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    completedChallenges: [],
    achievements: []
  });
  const [activeTab, setActiveTab] = useState<'daily' | 'achievements' | 'progress'>('daily');

  useEffect(() => {
    if (visible) {
      loadUserProgress();
      generateChallenges();
      checkAndUpdateChallenges();
    }
  }, [visible, gameState]);

  // Add a function to update challenge progress
  const updateChallengeProgress = (challengeId: string, progress: number) => {
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => {
        if (challenge.id === challengeId) {
          // Don't update if already completed
          if (challenge.completed) return challenge;
          
          // Update progress, but don't exceed maxProgress
          const newProgress = Math.min(progress, challenge.maxProgress);
          return { ...challenge, progress: newProgress };
        }
        return challenge;
      })
    );
  };

  // Add a function to check and update all challenges based on current game state
  const checkAndUpdateChallenges = () => {
    // Portfolio value for "Portfolio Pioneer" achievement
    const portfolioValue = gameState.portfolioValue || 0;
    updateChallengeProgress('ach1', portfolioValue);
    
    // Check for "Millionaire Club" achievement
    updateChallengeProgress('ach4', portfolioValue);
    
    // Number of profitable trades for "Market Master" achievement
    const profitableTrades = gameState.profitableTrades || 0;
    updateChallengeProgress('ach2', profitableTrades);
    
    // Check for "Trading Legend" achievement
    updateChallengeProgress('ach5', profitableTrades);
    
    // Number of sectors for "Diversifier" challenge
    const sectors = gameState.portfolioSectors || [];
    updateChallengeProgress('daily3', sectors.length);
    
    // Check for "Sector Specialist" achievement
    updateChallengeProgress('ach6', sectors.length);
    
    // Number of trades today for "Day Trader" challenge
    const tradesToday = gameState.tradesToday || 0;
    updateChallengeProgress('daily4', tradesToday);
    
    // Largest trade for "Big Spender" challenge
    const largestTrade = gameState.largestTrade || 0;
    updateChallengeProgress('daily5', largestTrade >= 10000 ? 1 : 0);
    
    // Highest profit percentage for "Quick Profit" achievement
    const highestProfitPercent = gameState.highestProfitPercent || 0;
    updateChallengeProgress('ach7', highestProfitPercent >= 20 ? 1 : 0);
    
    // Longest holding period for "Long-term Investor" achievement
    const longestHoldingDays = gameState.longestHoldingDays || 0;
    updateChallengeProgress('ach8', longestHoldingDays);
  };

  const loadUserProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('userProgress');
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const saveUserProgress = async (progress: UserProgress) => {
    try {
      await AsyncStorage.setItem('userProgress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  };

  const generateChallenges = () => {
    // Generate daily challenges
    const dailyChallenges: Challenge[] = [
      {
        id: 'daily1',
        title: 'First Trade',
        description: 'Make your first stock purchase',
        reward: 500,
        completed: userProgress.completedChallenges.includes('daily1'),
        progress: 0,
        maxProgress: 1,
        type: 'daily'
      },
      {
        id: 'daily2',
        title: 'Profit Maker',
        description: 'Make a 5% profit on any stock',
        reward: 1000,
        completed: userProgress.completedChallenges.includes('daily2'),
        progress: 0,
        maxProgress: 1,
        type: 'daily'
      },
      {
        id: 'daily3',
        title: 'Diversifier',
        description: 'Own stocks from 3 different sectors',
        reward: 1500,
        completed: userProgress.completedChallenges.includes('daily3'),
        progress: 0,
        maxProgress: 3,
        type: 'daily'
      },
      {
        id: 'daily4',
        title: 'Day Trader',
        description: 'Make 3 trades in a single day',
        reward: 2000,
        completed: userProgress.completedChallenges.includes('daily4'),
        progress: 0,
        maxProgress: 3,
        type: 'daily'
      },
      {
        id: 'daily5',
        title: 'Big Spender',
        description: 'Invest $10,000 in a single trade',
        reward: 2500,
        completed: userProgress.completedChallenges.includes('daily5'),
        progress: 0,
        maxProgress: 1,
        type: 'daily'
      }
    ];

    // Generate achievements
    const achievementChallenges: Challenge[] = [
      {
        id: 'ach1',
        title: 'Portfolio Pioneer',
        description: 'Reach a portfolio value of $150,000',
        reward: 2500,
        completed: userProgress.achievements.includes('ach1'),
        progress: 0,
        maxProgress: 150000,
        type: 'achievement'
      },
      {
        id: 'ach2',
        title: 'Market Master',
        description: 'Make 10 profitable trades',
        reward: 5000,
        completed: userProgress.achievements.includes('ach2'),
        progress: 0,
        maxProgress: 10,
        type: 'achievement'
      },
      {
        id: 'ach3',
        title: 'Risk Taker',
        description: 'Invest 50% of your portfolio in a single stock',
        reward: 4000,
        completed: userProgress.achievements.includes('ach3'),
        progress: 0,
        maxProgress: 1,
        type: 'achievement'
      },
      {
        id: 'ach4',
        title: 'Millionaire Club',
        description: 'Reach a portfolio value of $1,000,000',
        reward: 10000,
        completed: userProgress.achievements.includes('ach4'),
        progress: 0,
        maxProgress: 1000000,
        type: 'achievement'
      },
      {
        id: 'ach5',
        title: 'Trading Legend',
        description: 'Make 50 profitable trades',
        reward: 8000,
        completed: userProgress.achievements.includes('ach5'),
        progress: 0,
        maxProgress: 50,
        type: 'achievement'
      },
      {
        id: 'ach6',
        title: 'Sector Specialist',
        description: 'Own stocks from all available sectors',
        reward: 6000,
        completed: userProgress.achievements.includes('ach6'),
        progress: 0,
        maxProgress: 5,
        type: 'achievement'
      },
      {
        id: 'ach7',
        title: 'Quick Profit',
        description: 'Make a 20% profit in a single trade',
        reward: 5000,
        completed: userProgress.achievements.includes('ach7'),
        progress: 0,
        maxProgress: 1,
        type: 'achievement'
      },
      {
        id: 'ach8',
        title: 'Long-term Investor',
        description: 'Hold a stock for 30 days',
        reward: 7000,
        completed: userProgress.achievements.includes('ach8'),
        progress: 0,
        maxProgress: 30,
        type: 'achievement'
      }
    ];

    setChallenges([...dailyChallenges, ...achievementChallenges]);
  };

  const handleClaimReward = (challenge: Challenge) => {
    if (challenge.completed) {
      Alert.alert('Already Claimed', 'You have already claimed this reward.');
      return;
    }

    // Check if the challenge is actually completed
    if (challenge.progress < challenge.maxProgress) {
      Alert.alert('Challenge Not Complete', 'You need to complete the challenge requirements before claiming the reward.');
      return;
    }

    // Update cash
    const newCash = cash + challenge.reward;
    setCash(newCash);

    // Update user progress
    const newCompletedChallenges = [...userProgress.completedChallenges, challenge.id];
    const newAchievements = challenge.type === 'achievement' 
      ? [...userProgress.achievements, challenge.id]
      : userProgress.achievements;

    // Add experience
    const experienceGained = challenge.reward / 10; // 10% of reward as experience
    let newExperience = userProgress.experience + experienceGained;
    let newLevel = userProgress.level;
    let newExperienceToNextLevel = userProgress.experienceToNextLevel;

    // Check for level up
    if (newExperience >= newExperienceToNextLevel) {
      newLevel += 1;
      newExperience -= newExperienceToNextLevel;
      newExperienceToNextLevel = Math.floor(newExperienceToNextLevel * 1.5); // Increase XP needed for next level
    }

    const updatedProgress: UserProgress = {
      ...userProgress,
      level: newLevel,
      experience: newExperience,
      experienceToNextLevel: newExperienceToNextLevel,
      completedChallenges: newCompletedChallenges,
      achievements: newAchievements
    };

    setUserProgress(updatedProgress);
    saveUserProgress(updatedProgress);

    // Update challenges
    const updatedChallenges = challenges.map(c => 
      c.id === challenge.id ? { ...c, completed: true, progress: c.maxProgress } : c
    );
    setChallenges(updatedChallenges);

    // Notify parent component
    onCompleteChallenge(challenge.id, challenge.reward);

    Alert.alert('Reward Claimed', `You received $${challenge.reward} and ${experienceGained} XP!`);
  };

  const renderChallengeItem = (challenge: Challenge) => {
    const progressPercent = (challenge.progress / challenge.maxProgress) * 100;
    
    return (
      <View key={challenge.id} style={styles.challengeItem}>
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengeReward}>${challenge.reward}</Text>
        </View>
        <Text style={styles.challengeDescription}>{challenge.description}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {challenge.progress}/{challenge.maxProgress}
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.claimButton, 
            challenge.completed && styles.claimedButton
          ]}
          onPress={() => handleClaimReward(challenge)}
          disabled={challenge.completed}
        >
          <Text style={styles.claimButtonText}>
            {challenge.completed ? 'Claimed' : 'Claim Reward'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderProgressTab = () => {
    const levelProgressPercent = (userProgress.experience / userProgress.experienceToNextLevel) * 100;
    
    return (
      <View style={styles.progressTab}>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Level {userProgress.level}</Text>
          <View style={styles.levelProgressBar}>
            <View style={[styles.levelProgressFill, { width: `${levelProgressPercent}%` }]} />
          </View>
          <Text style={styles.experienceText}>
            {userProgress.experience}/{userProgress.experienceToNextLevel} XP
          </Text>
        </View>
        
        <View style={styles.levelBenefits}>
          <Text style={styles.benefitsTitle}>Level Benefits</Text>
          <View style={styles.benefitItem}>
            <Ionicons name="cash-outline" size={20} color="#4a90e2" />
            <Text style={styles.benefitText}>+5% daily interest at level 5</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="trending-up-outline" size={20} color="#4a90e2" />
            <Text style={styles.benefitText}>Advanced charts at level 10</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="notifications-outline" size={20} color="#4a90e2" />
            <Text style={styles.benefitText}>Price alerts at level 15</Text>
          </View>
        </View>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Challenges & Achievements</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
          onPress={() => setActiveTab('daily')}
        >
          <Text style={styles.tabText}>Daily Challenges</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={styles.tabText}>Achievements</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'progress' && styles.activeTab]}
          onPress={() => setActiveTab('progress')}
        >
          <Text style={styles.tabText}>Progress</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'progress' ? (
          renderProgressTab()
        ) : (
          challenges
            .filter(challenge => 
              activeTab === 'daily' 
                ? challenge.type === 'daily' 
                : challenge.type === 'achievement'
            )
            .map(renderChallengeItem)
        )}
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#4a90e2',
  },
  tabText: {
    color: '#333',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  challengeItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  challengeReward: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#999',
    width: 40,
    textAlign: 'right',
  },
  claimButton: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  claimedButton: {
    backgroundColor: '#ccc',
  },
  claimButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  progressTab: {
    padding: 15,
  },
  levelContainer: {
    marginBottom: 20,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  levelProgressBar: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
    borderRadius: 5,
  },
  experienceText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  levelBenefits: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    marginLeft: 10,
  },
});

export default Challenges; 