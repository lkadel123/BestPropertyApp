import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const borderColor = isDarkMode ? '#444' : '#eee';
  const iconColor = isDarkMode ? '#fff' : '#333';

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <SettingItem
        icon="person-outline"
        label="Account"
        onPress={() => navigation.navigate('Account')}
        iconColor={iconColor}
        textColor={textColor}
        borderColor={borderColor}
      />

      <SettingItem
        icon="notifications-outline"
        label="Notifications"
        rightElement={
          <Switch
            value={true}
            onValueChange={() => {}}
            thumbColor={isDarkMode ? '#fff' : undefined}
          />
        }
        iconColor={iconColor}
        textColor={textColor}
        borderColor={borderColor}
      />

      <SettingItem
        icon="moon-outline"
        label="Dark Mode"
        rightElement={
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            thumbColor={isDarkMode ? '#fff' : undefined}
          />
        }
        iconColor={iconColor}
        textColor={textColor}
        borderColor={borderColor}
      />

      <SettingItem
        icon="globe-outline"
        label="Language"
        onPress={() => console.log('Language selector')}
        iconColor={iconColor}
        textColor={textColor}
        borderColor={borderColor}
      />

      <SettingItem
        icon="shield-checkmark-outline"
        label="Privacy & Security"
        onPress={() => navigation.navigate('PrivacySecurity')}
        iconColor={iconColor}
        textColor={textColor}
        borderColor={borderColor}
      />

      <SettingItem
        icon="information-circle-outline"
        label="About"
        onPress={() => navigation.navigate('About')}
        iconColor={iconColor}
        textColor={textColor}
        borderColor={borderColor}
      />

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SettingItem({ icon, label, onPress, rightElement, iconColor, textColor, borderColor }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, { borderBottomColor: borderColor }]}>
      <View style={styles.left}>
        <Ionicons name={icon} size={22} color={iconColor} />
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </View>
      {rightElement || <Ionicons name="chevron-forward" size={20} color={iconColor} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 40,
    alignSelf: 'center',
  },
  logoutText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
});
