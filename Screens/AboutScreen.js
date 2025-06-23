import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function AboutScreen() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const headingColor = isDarkMode ? '#fff' : '#333';
  const labelColor = isDarkMode ? '#ccc' : '#555';
  const textColor = isDarkMode ? '#aaa' : '#444';
  const linkColor = '#007bff';

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.heading, { color: headingColor }]}>
        About Our Property App
      </Text>

      <View style={styles.section}>
        <Text style={[styles.label, { color: labelColor }]}>Version</Text>
        <Text style={[styles.text, { color: textColor }]}>1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: labelColor }]}>Developed By</Text>
        <Text style={[styles.text, { color: textColor }]}>BG Tech Innovations</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: labelColor }]}>Purpose</Text>
        <Text style={[styles.text, { color: textColor }]}>
          This app helps users browse, buy, and rent properties with ease.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: labelColor }]}>Contact Us</Text>
        <Text
          style={[styles.text, { color: linkColor }]}
          onPress={() => Linking.openURL('mailto:support@bgtech.com')}
        >
          support@bgtech.com
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: labelColor }]}>Privacy Policy</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://example.com/privacy')}>
          <Text style={[styles.link, { color: linkColor }]}>View our privacy policy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  link: {
    fontWeight: '500',
  },
});

