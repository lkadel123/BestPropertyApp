import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; // 👈 Theme hook

export default function ProfileScreen({ navigation }) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const subTextColor = isDarkMode ? '#aaa' : '#666';
  const iconColor = isDarkMode ? '#fff' : '#333';
  const borderColor = isDarkMode ? '#444' : '#eee';

  const user = {
    name: 'Laxman Kadel',
    email: 'laxman@example.com',
    avatar: require('../assets/Images/download.jpg'),
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Image source={user.avatar} style={styles.avatar} />
      <Text style={[styles.name, { color: textColor }]}>{user.name}</Text>
      <Text style={[styles.email, { color: subTextColor }]}>{user.email}</Text>

      <View style={styles.menu}>
        <MenuItem
          icon="heart-outline"
          label="Saved Properties"
          onPress={() => console.log('Go to Saved Properties')}
          iconColor={iconColor}
          textColor={textColor}
          borderColor={borderColor}
        />
        <MenuItem
          icon="settings-outline"
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
          iconColor={iconColor}
          textColor={textColor}
          borderColor={borderColor}
        />
        <MenuItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => console.log('Open Help')}
          iconColor={iconColor}
          textColor={textColor}
          borderColor={borderColor}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logout')}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function MenuItem({ icon, label, onPress, iconColor, textColor, borderColor }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.menuItem, { borderBottomColor: borderColor }]}>
      <View style={styles.left}>
        <Ionicons name={icon} size={22} color={iconColor} />
        <Text style={[styles.menuLabel, { color: textColor }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    flexGrow: 1,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 24,
  },
  menu: {
    width: '100%',
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    marginLeft: 16,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  logoutText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
});
