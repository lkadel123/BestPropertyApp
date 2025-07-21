import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const featuredProperties = [
  {
    id: '1',
    title: '3BHK Apartment in Sector 21',
    price: '₹85L',
    image: require('../assets/Images/IMG-20240920-WA0007.jpg'),
    tag: 'NEW',
  },
  {
    id: '2',
    title: '2BHK Flat in Kharar',
    price: '₹45L',
    image: require('../assets/Images/f77a3719c49f4246050cea758d007af1-cc_ft_960.webp'),
    tag: 'HOT',
  },
  {
    id: '3',
    title: 'Luxury Villa in Mohali',
    price: '₹2.5Cr',
    image: require('../assets/Images/pune-properties2.jpg'),
    tag: 'VERIFIED',
  },
];

export default function FeaturedCarousel() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔥 Featured Properties</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={featuredProperties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.tag}><Text style={styles.tagText}>{item.tag}</Text></View>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button}>
                <Ionicons name="eye" size={16} color="#fff" />
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Ionicons name="call" size={16} color="#fff" />
                <Text style={styles.buttonText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: width * 0.8,
    marginRight: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    paddingBottom: 10,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 150,
  },
  tag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginHorizontal: 10,
    color: '#333',
  },
  title: {
    fontSize: 14,
    color: '#555',
    marginHorizontal: 10,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-around',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 13,
  },
});