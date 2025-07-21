// SettingsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  Button,
  ScrollView,
  Alert,
} from 'react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [leadUpdateEnabled, setLeadUpdateEnabled] = useState(true);
  const [apiUrl, setApiUrl] = useState('https://api.example.com');
  const [defaultRole, setDefaultRole] = useState('Agent');

  // New Property App Settings
  const [propertyApproval, setPropertyApproval] = useState(true);
  const [featuredPropertyLimit, setFeaturedPropertyLimit] = useState('10');
  const [defaultCity, setDefaultCity] = useState('Mumbai');
  const [allowUserSubmission, setAllowUserSubmission] = useState(true);
  const [maxImageUpload, setMaxImageUpload] = useState('5');

  // User Access Control Settings
  const [allowRoleChange, setAllowRoleChange] = useState(true);
  const [restrictDeleteUsers, setRestrictDeleteUsers] = useState(false);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [enableTwoFactorAuth, setEnableTwoFactorAuth] = useState(true);

  const handleSave = () => {
    Alert.alert('✅ Settings Saved', `Changes saved:\nAPI: ${apiUrl}\nDefault Role: ${defaultRole}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.label}>Enable Notifications</Text>
      <Switch
        value={notificationsEnabled}
        onValueChange={setNotificationsEnabled}
      />

      <Text style={styles.label}>Enable Dark Mode</Text>
      <Switch
        value={darkModeEnabled}
        onValueChange={setDarkModeEnabled}
      />

      <Text style={styles.label}>Lead Update Alerts</Text>
      <Switch
        value={leadUpdateEnabled}
        onValueChange={setLeadUpdateEnabled}
      />

      <Text style={styles.label}>API Endpoint</Text>
      <TextInput
        style={styles.input}
        value={apiUrl}
        onChangeText={setApiUrl}
      />

      <Text style={styles.label}>Default Role for New Users</Text>
      <TextInput
        style={styles.input}
        value={defaultRole}
        onChangeText={setDefaultRole}
      />

      <Text style={styles.subHeader}>🏡 Property App Settings</Text>

      <Text style={styles.label}>Require Property Approval</Text>
      <Switch
        value={propertyApproval}
        onValueChange={setPropertyApproval}
      />

      <Text style={styles.label}>Max Featured Properties</Text>
      <TextInput
        style={styles.input}
        value={featuredPropertyLimit}
        onChangeText={setFeaturedPropertyLimit}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Default City for Listings</Text>
      <TextInput
        style={styles.input}
        value={defaultCity}
        onChangeText={setDefaultCity}
      />

      <Text style={styles.label}>Allow User Property Submission</Text>
      <Switch
        value={allowUserSubmission}
        onValueChange={setAllowUserSubmission}
      />

      <Text style={styles.label}>Max Image Upload per Property</Text>
      <TextInput
        style={styles.input}
        value={maxImageUpload}
        onChangeText={setMaxImageUpload}
        keyboardType="numeric"
      />

      <Text style={styles.subHeader}>🔐 User Access Control Settings</Text>

      <Text style={styles.label}>Allow Role Change</Text>
      <Switch
        value={allowRoleChange}
        onValueChange={setAllowRoleChange}
      />

      <Text style={styles.label}>Restrict User Deletion</Text>
      <Switch
        value={restrictDeleteUsers}
        onValueChange={setRestrictDeleteUsers}
      />

      <Text style={styles.label}>Max Login Attempts</Text>
      <TextInput
        style={styles.input}
        value={maxLoginAttempts}
        onChangeText={setMaxLoginAttempts}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Enable Two-Factor Authentication</Text>
      <Switch
        value={enableTwoFactorAuth}
        onValueChange={setEnableTwoFactorAuth}
      />

      <Button title="💾 Save Settings" onPress={handleSave} color="#2980b9" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
});
