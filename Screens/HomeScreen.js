import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import CategoryButton from '../Components/CategoryButton';
import PropertyCard from '../Components/PropertyCard';

const categories = ['Buy', 'Rent', 'Commercial', 'Land'];

const properties = [
  {
    id: '1',
    title: 'Modern Villa in Kathmandu',
    price: 'Rs. 1,20,00,000',
    category: 'Buy',
    image: require('../assets/Images/24_03_2025_12_31_15_night_view.jpg'),
  },
  {
    id: '2',
    title: 'Apartment in Pokhara Lakeside',
    price: 'Rs. 8,50,000',
    category: 'Buy',
    image: require('../assets/Images/1274000_1-350x350.jpg'),
  },
  {
    id: '3',
    title: 'Office Space in Lalitpur',
    price: 'Rs. 1,500/mo',
    category: 'Commercial',
    image: require('../assets/Images/beautiful-home-exterior-600nw-160071032.webp'),
  },
  {
    id: '4',
    title: 'Open Land in Bhaktapur',
    price: 'Rs. 30,00,000',
    category: 'Land',
    image: require('../assets/Images/f77a3719c49f4246050cea758d007af1-cc_ft_960.webp'),
  },
  {
    id: '5',
    title: 'Family House in Baneshwor',
    price: 'Rs. 90,00,000',
    category: 'Buy',
    image: require('../assets/Images/images.jpg'),
  },
  {
    id: '6',
    title: 'Smart Bungalow in Naxal',
    price: 'Rs. 15,000/mo',
    category: 'Rent',
    image: require('../assets/Images/IMG-20240920-WA0007.jpg'),
  },
  {
    id: '7',
    title: 'Duplex in Kirtipur',
    price: 'Rs. 70,00,000',
    category: 'Buy',
    image: require('../assets/Images/istockphoto-1987630154-612x612.jpg'),
  },
  {
    id: '8',
    title: 'Flat for Rent in Kalanki',
    price: 'Rs. 12,000/mo',
    category: 'Rent',
    image: require('../assets/Images/maxresdefault.jpg'),
  },
  {
    id: '9',
    title: 'Commercial Shop in Thamel',
    price: 'Rs. 25,000/mo',
    category: 'Commercial',
    image: require('../assets/Images/pune-properties2.jpg'),
  },
  {
    id: '10',
    title: 'Luxury Penthouse in Lazimpat',
    price: 'Rs. 1,60,00,000',
    category: 'Buy',
    image: require('../assets/Images/beautiful-home-exterior-600nw-160071032.webp'),
  },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const inputBgColor = isDarkMode ? '#1a1a1a' : '#f0f0f0';

  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredProperties = selectedCategory
    ? properties.filter((p) => p.category === selectedCategory)
    : properties;

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
      <Image
        source={require('../assets/Images/beautiful-home-exterior-600nw-160071032.webp')}
        style={styles.heroBanner}
        resizeMode="cover"
      />

      <Text style={[styles.header, { color: textColor }]}>Find Your Dream Property</Text>

      <TextInput
        placeholder="Search for homes, apartments..."
        placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
        style={[styles.searchInput, { backgroundColor: inputBgColor, color: textColor }]}
      />

      <View style={styles.categories}>
        {categories.map((label) => (
          <CategoryButton
            key={label}
            label={label}
            isSelected={label === selectedCategory}
            onPress={() => setSelectedCategory(label)}
          />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.subheader, { color: textColor }]}>Recently Listed</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PropertyCard property={item} />}
        contentContainerStyle={styles.cardList}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.sectionHeader}>
        <Text style={[styles.subheader, { color: textColor }]}>Recommended For You</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {filteredProperties.map((item) => (
        <PropertyCard key={item.id} property={item} style={styles.horizontalproperty} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  heroBanner: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchInput: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  subheader: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  viewAll: {
    color: '#007bff',
    fontSize: 14,
  },
  cardList: {
    paddingBottom: 12,
  },
  horizontalproperty: {
    marginRight: 16,
    marginBottom: 30,
    padding: 30,
    backgroundColor: '#f9f9f9',
  },
});
