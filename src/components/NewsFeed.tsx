import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Linking,
  RefreshControl,
  Animated,
  Platform
} from 'react-native';
import { NewsFeedProps } from '../types';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  url: string;
  imageUrl: string;
  summary: string;
  relatedTickers: string[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({
  news,
  isLoading,
  onRefresh,
  filterByTicker
}) => {
  // Add animation state
  const [fadeAnim] = useState(new Animated.Value(1));

  const filteredNews = filterByTicker
    ? news.filter(item => item.relatedTickers.includes(filterByTicker))
    : news;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRefresh = () => {
    // Animate fade out
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: Platform.OS === 'ios'
    }).start(() => {
      onRefresh();
      // Animate fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: Platform.OS === 'ios'
      }).start();
    });
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <Animated.View style={[styles.newsItem, { opacity: fadeAnim }]}>
      <TouchableOpacity
        onPress={() => Linking.openURL(item.url)}
        style={styles.newsItemTouchable}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.newsImage}
        />
        <View style={styles.newsContent}>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsDate}>{formatDate(item.date)}</Text>
          <Text style={styles.newsSummary} numberOfLines={2}>
            {item.summary}
          </Text>
          <View style={styles.tickerContainer}>
            {item.relatedTickers.map(ticker => (
              <Text key={ticker} style={styles.ticker}>
                #{ticker}
              </Text>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredNews}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#4a90e2"
          />
        }
        ListEmptyComponent={
          <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
            <Text style={styles.emptyText}>
              {filterByTicker
                ? `No news available for ${filterByTicker}`
                : 'No news available'}
            </Text>
          </Animated.View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f5f5f5'
  },
  newsItem: {
    backgroundColor: '#fff',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  newsItemTouchable: {
    flexDirection: 'row',
    padding: 15,
  },
  newsImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  newsContent: {
    flex: 1,
    marginLeft: 15,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  newsDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  newsSummary: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
    lineHeight: 20,
  },
  tickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  ticker: {
    fontSize: 12,
    color: '#4a90e2',
    marginRight: 8,
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default NewsFeed; 