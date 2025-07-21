import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function StatusRating({
  rating = 0,
  onRate = () => {},
  max = 5,
  title = '⭐ Status Rating',
}) {
  const handlePress = (value) => {
    if (typeof onRate === 'function') {
      onRate(value);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.starsRow}>
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handlePress(star)}
            style={styles.starButton}
          >
            <Feather
              name="star"
              size={24}
              color={star <= rating ? '#f1c40f' : '#ccc'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    elevation: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  starButton: {
    marginRight: 10,
  },
});
