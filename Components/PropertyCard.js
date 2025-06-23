import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import CardButton from './CardButton';

export default function PropertyCard({ property }) {
  return (
    <View style={styles.card}>
      <Image source={property.image} style={styles.image} />
      <Text style={styles.title}>{property.title}</Text>
      <Text style={styles.price}>{property.price}</Text>

      {/* Wrapper to push button to right */}
      <View style={styles.buttonWrapper}>
        <CardButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    marginRight: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    marginBottom: 16,
    marginTop: 10,
    paddingBottom: 10,
  },
  image: {
    height: 130,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 6,
    marginHorizontal: 8,
  },
  price: {
    fontSize: 14,
    color: '#555',
    marginHorizontal: 8,
    marginBottom: 10,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
  },
});

