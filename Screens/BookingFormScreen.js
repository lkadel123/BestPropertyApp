import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';

export default function BookingFormScreen({ route, navigation }) {
  const { property } = route.params;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const handleBooking = () => {
    if (!fullName || !phone || !date) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    Alert.alert('Success', `Booking request sent for ${property.title}`);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={property.image} style={styles.image} />
      <Text style={styles.title}>{property.title}</Text>
      <Text style={styles.price}>{property.price}</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Preferred Visit Date</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />

      <Text style={styles.label}>Note (optional)</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        value={note}
        onChangeText={setNote}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Submit Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 6,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 14,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
