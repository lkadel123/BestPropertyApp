import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { Feather, MaterialIcons } from '@expo/vector-icons';

const StepLocation = ({ formData, updateForm }) => {
  const [loading, setLoading] = useState(false);
  const isOnsite = formData.locationType === 'onsite';

  const handleTypeChange = (type) => {
    updateForm('locationType', type);
    updateForm('locationValue', '');
  };

  const getReadableAddress = async (coords) => {
    try {
      const geocode = await Location.reverseGeocodeAsync(coords);
      if (geocode.length > 0) {
        const { name, street, city, region, postalCode } = geocode[0];
        return `${name || ''} ${street || ''}, ${city || ''}, ${region || ''} ${postalCode || ''}`;
      }
      return '';
    } catch {
      return '';
    }
  };

  const useCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await getReadableAddress(location.coords);
      if (address) {
        updateForm('locationValue', address);
        Alert.alert('Location set', address);
      } else {
        Alert.alert('Could not fetch address');
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to get location.');
    } finally {
      setLoading(false);
    }
  };

  const validateURL = (url) => {
    const regex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    return regex.test(url);
  };

  const handleBlur = () => {
    if (!isOnsite && formData.locationValue && !validateURL(formData.locationValue)) {
      Alert.alert('Invalid Link', 'Please enter a valid Zoom or Meet URL');
      updateForm('locationValue', '');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location Type</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, isOnsite && styles.activeToggle]}
          onPress={() => handleTypeChange('onsite')}
        >
          <Feather name="map-pin" size={18} color={isOnsite ? '#fff' : '#333'} />
          <Text style={[styles.toggleText, isOnsite && styles.activeText]}>
            Onsite
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, !isOnsite && styles.activeToggle]}
          onPress={() => handleTypeChange('virtual')}
        >
          <MaterialIcons
            name="video-call"
            size={20}
            color={!isOnsite ? '#fff' : '#333'}
          />
          <Text style={[styles.toggleText, !isOnsite && styles.activeText]}>
            Office
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        {isOnsite ? 'Meeting Address' : 'Office Address'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={
          isOnsite
            ? 'e.g. 123 MG Road, Bangalore'
            : 'Office Address'
        }
        value={formData.locationValue}
        onChangeText={(text) => updateForm('locationValue', text)}
        onBlur={handleBlur}
      />

      {isOnsite && (
        <TouchableOpacity
          style={styles.mapBtn}
          onPress={useCurrentLocation}
          disabled={loading}
        >
          <Feather name="crosshair" size={16} color="#007AFF" />
          <Text style={styles.mapBtnText}>
            {loading ? 'Locating...' : 'Current Location'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10 },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
    marginTop: 5,
    marginBottom: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
    marginRight: 10,
  },
  toggleText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#333',
  },
  activeToggle: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  activeText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    backgroundColor: '#fff',
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  mapBtnText: {
    marginLeft: 6,
    color: '#007AFF',
    fontSize: 15,
  },
});

export default StepLocation;

