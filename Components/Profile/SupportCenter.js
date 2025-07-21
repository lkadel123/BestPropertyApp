import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

const Tile = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.tile} onPress={onPress}>
    {icon}
    <Text style={styles.tileText}>{label}</Text>
  </TouchableOpacity>
);

export default function SupportCenter() {
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('General');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const categories = ['Bug', 'Suggestion', 'Feature Request', 'Other'];

  const handleSubmitFeedback = () => {
    if (!feedback) return Alert.alert('Empty', 'Please type your feedback.');
    // Send to backend
    Alert.alert('Thank you', 'Feedback submitted successfully.');
    setFeedback('');
  };

  const openWhatsApp = () => {
    const phone = '+919876543210';
    const url = `whatsapp://send?phone=${phone}`;
    Linking.canOpenURL(url).then(supported => {
      supported ? Linking.openURL(url) : Alert.alert('Install WhatsApp');
    });
  };

  const openEmail = () => {
    Linking.openURL('mailto:support@example.com?subject=App%20Support');
  };

  const openLiveChat = () => {
    Alert.alert('Coming Soon', 'Live chat integration is under development.');
  };

  return (
      <ScrollView>
            <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Support Center</Text>

      {/* Core Tiles */}
      <Tile
        icon={<Ionicons name="help-circle-outline" size={24} color="#333" />}
        label="FAQ / How it Works"
        onPress={() => Alert.alert('FAQ', 'Open FAQ section')}
      />
      <Tile
        icon={<Ionicons name="logo-whatsapp" size={24} color="#25D366" />}
        label="WhatsApp Support"
        onPress={openWhatsApp}
      />
      <Tile
        icon={<Ionicons name="mail-outline" size={24} color="#007bff" />}
        label="Email Support"
        onPress={openEmail}
      />
      <Tile
        icon={<Ionicons name="chatbubbles-outline" size={24} color="#0099cc" />}
        label="Live Chat"
        onPress={openLiveChat}
      />

      {/* 🔁 Toggle Notifications */}
      <Tile
        icon={
          <Feather
            name={notificationsEnabled ? 'bell' : 'bell-off'}
            size={24}
            color={notificationsEnabled ? '#673ab7' : '#999'}
          />
        }
        label={`Notifications: ${notificationsEnabled ? 'On' : 'Off'}`}
        onPress={() => setNotificationsEnabled(!notificationsEnabled)}
      />

      {/* 🐞 Feedback Form */}
      <View style={styles.feedbackBox}>
        <Text style={styles.subHeading}>Send us Feedback</Text>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.categorySelected,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={category === cat ? styles.catSelectedText : styles.catText}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Describe your issue or suggestion..."
          multiline
          value={feedback}
          onChangeText={setFeedback}
        />
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitFeedback}>
          <Text style={styles.submitText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>App Version: 1.0.0 (build 1001)</Text>
    </ScrollView>
    <View style={{ height: 40 }} /> {/* Spacer for bottom padding */}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tileText: {
    fontSize: 16,
    marginLeft: 16,
  },
  feedbackBox: {
    marginTop: 30,
    paddingTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  categoryButton: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  categorySelected: {
    backgroundColor: '#007bff',
  },
  catText: {
    color: '#333',
    fontSize: 13,
  },
  catSelectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
  version: {
    marginTop: 40,
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
  },
});
