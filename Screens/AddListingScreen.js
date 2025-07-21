import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';

import BuyProperty from '../Components/AddProperty/BuyProperty';
import SellProperty from '../Components/AddProperty/SellProperty';

const { width } = Dimensions.get('window');

export default function AddListingScreen() {
  const [category, setCategory] = useState('sales');
  const colorScheme = useColorScheme();

  return (
    <ScrollView style={styles.container}>
      {/* Top Tabs for Category Selection */}
      <View style={styles.categoryTabs}>
        <TouchableOpacity
          onPress={() => setCategory('sales')}
          style={[styles.categoryTab, category === 'sales' && styles.activeCategoryTab]}
        >
          <Text style={[styles.categoryTabText, category === 'sales' && styles.activeCategoryTabText]}>
            Sales
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCategory('requirement')}
          style={[styles.categoryTab, category === 'requirement' && styles.activeCategoryTab]}
        >
          <Text style={[styles.categoryTabText, category === 'requirement' && styles.activeCategoryTabText]}>
            Requirement
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Content */}
      <View style={styles.formWrapper}>
        {category === 'sales' ? <SellProperty /> : <BuyProperty />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 1,
    backgroundColor: '#fff',
  },
  categoryTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 8,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeCategoryTab: {
    borderColor: '#007bff',
  },
  categoryTabText: {
    fontSize: 16,
    color: '#444',
  },
  activeCategoryTabText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  formWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});


