import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Switch
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Sectors for filter options
const SECTORS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Cyclical',
  'Industrials',
  'Communication Services',
  'Consumer Defensive',
  'Energy',
  'Basic Materials',
  'Real Estate',
  'Utilities'
];

// Price ranges for filter options
const PRICE_RANGES = [
  { label: 'Under $10', min: 0, max: 10 },
  { label: '$10 - $50', min: 10, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $500', min: 100, max: 500 },
  { label: 'Over $500', min: 500, max: Infinity }
];

export type SortOption = 'nameAsc' | 'nameDesc' | 'priceAsc' | 'priceDesc' | 'performanceAsc' | 'performanceDesc';

interface FilterOptions {
  sectors: string[];
  priceRanges: { min: number; max: number }[];
  showOnlyPortfolioStocks: boolean;
}

interface StockFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (sortOption: SortOption, filters: FilterOptions) => void;
  currentSortOption?: SortOption;
  currentFilters?: FilterOptions;
}

const defaultFilters: FilterOptions = {
  sectors: [],
  priceRanges: [],
  showOnlyPortfolioStocks: false
};

const StockFilters = ({ 
  visible, 
  onClose,
  onApplyFilters,
  currentSortOption = 'nameAsc',
  currentFilters = defaultFilters
}: StockFiltersProps) => {
  const [sortOption, setSortOption] = useState<SortOption>(currentSortOption);
  const [selectedSectors, setSelectedSectors] = useState<string[]>(currentFilters.sectors);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<{ min: number; max: number }[]>(
    currentFilters.priceRanges
  );
  const [showOnlyPortfolioStocks, setShowOnlyPortfolioStocks] = useState<boolean>(
    currentFilters.showOnlyPortfolioStocks
  );
  
  const handleSectorToggle = (sector: string) => {
    if (selectedSectors.includes(sector)) {
      setSelectedSectors(selectedSectors.filter(s => s !== sector));
    } else {
      setSelectedSectors([...selectedSectors, sector]);
    }
  };
  
  const handlePriceRangeToggle = (range: { min: number; max: number }) => {
    const isSelected = selectedPriceRanges.some(
      r => r.min === range.min && r.max === range.max
    );
    
    if (isSelected) {
      setSelectedPriceRanges(
        selectedPriceRanges.filter(r => !(r.min === range.min && r.max === range.max))
      );
    } else {
      setSelectedPriceRanges([...selectedPriceRanges, range]);
    }
  };
  
  const handleApply = () => {
    const filters: FilterOptions = {
      sectors: selectedSectors,
      priceRanges: selectedPriceRanges,
      showOnlyPortfolioStocks
    };
    
    onApplyFilters(sortOption, filters);
    onClose();
  };
  
  const handleReset = () => {
    setSortOption('nameAsc');
    setSelectedSectors([]);
    setSelectedPriceRanges([]);
    setShowOnlyPortfolioStocks(false);
  };

  const anyFiltersActive = () => {
    return (
      selectedSectors.length > 0 || 
      selectedPriceRanges.length > 0 || 
      showOnlyPortfolioStocks
    );
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Sort & Filter</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollView}>
            {/* Sort Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.sortOption, 
                    sortOption === 'nameAsc' && styles.selectedOption
                  ]}
                  onPress={() => setSortOption('nameAsc')}
                >
                  <Text style={styles.optionText}>Name (A-Z)</Text>
                  {sortOption === 'nameAsc' && (
                    <MaterialIcons name="check" size={18} color="#4285F4" />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.sortOption, 
                    sortOption === 'nameDesc' && styles.selectedOption
                  ]}
                  onPress={() => setSortOption('nameDesc')}
                >
                  <Text style={styles.optionText}>Name (Z-A)</Text>
                  {sortOption === 'nameDesc' && (
                    <MaterialIcons name="check" size={18} color="#4285F4" />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.sortOption, 
                    sortOption === 'priceAsc' && styles.selectedOption
                  ]}
                  onPress={() => setSortOption('priceAsc')}
                >
                  <Text style={styles.optionText}>Price (Low to High)</Text>
                  {sortOption === 'priceAsc' && (
                    <MaterialIcons name="check" size={18} color="#4285F4" />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.sortOption, 
                    sortOption === 'priceDesc' && styles.selectedOption
                  ]}
                  onPress={() => setSortOption('priceDesc')}
                >
                  <Text style={styles.optionText}>Price (High to Low)</Text>
                  {sortOption === 'priceDesc' && (
                    <MaterialIcons name="check" size={18} color="#4285F4" />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.sortOption, 
                    sortOption === 'performanceAsc' && styles.selectedOption
                  ]}
                  onPress={() => setSortOption('performanceAsc')}
                >
                  <Text style={styles.optionText}>Performance (Worst to Best)</Text>
                  {sortOption === 'performanceAsc' && (
                    <MaterialIcons name="check" size={18} color="#4285F4" />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.sortOption, 
                    sortOption === 'performanceDesc' && styles.selectedOption
                  ]}
                  onPress={() => setSortOption('performanceDesc')}
                >
                  <Text style={styles.optionText}>Performance (Best to Worst)</Text>
                  {sortOption === 'performanceDesc' && (
                    <MaterialIcons name="check" size={18} color="#4285F4" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Portfolio Filter */}
            <View style={styles.section}>
              <View style={styles.portfolioFilterContainer}>
                <Text style={styles.portfolioFilterText}>
                  Show only stocks in my portfolio
                </Text>
                <Switch
                  value={showOnlyPortfolioStocks}
                  onValueChange={setShowOnlyPortfolioStocks}
                  trackColor={{ false: '#ddd', true: '#4285F4' }}
                  thumbColor={showOnlyPortfolioStocks ? '#fff' : '#fff'}
                />
              </View>
            </View>
            
            {/* Sector Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sectors</Text>
              <View style={styles.optionsContainer}>
                {SECTORS.map(sector => (
                  <TouchableOpacity 
                    key={sector}
                    style={[
                      styles.filterOption, 
                      selectedSectors.includes(sector) && styles.selectedOption
                    ]}
                    onPress={() => handleSectorToggle(sector)}
                  >
                    <Text style={styles.optionText}>{sector}</Text>
                    {selectedSectors.includes(sector) && (
                      <MaterialIcons name="check" size={18} color="#4285F4" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Price Range Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.optionsContainer}>
                {PRICE_RANGES.map((range, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={[
                      styles.filterOption,
                      selectedPriceRanges.some(
                        r => r.min === range.min && r.max === range.max
                      ) && styles.selectedOption
                    ]}
                    onPress={() => handlePriceRangeToggle(range)}
                  >
                    <Text style={styles.optionText}>{range.label}</Text>
                    {selectedPriceRanges.some(
                      r => r.min === range.min && r.max === range.max
                    ) && (
                      <MaterialIcons name="check" size={18} color="#4285F4" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            {anyFiltersActive() && (
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>Reset All</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
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
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    minWidth: '45%',
  },
  selectedOption: {
    backgroundColor: '#E8F0FE',
    borderWidth: 1,
    borderColor: '#4285F4',
  },
  optionText: {
    fontSize: 14,
  },
  portfolioFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  portfolioFilterText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#555',
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#4285F4',
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StockFilters; 