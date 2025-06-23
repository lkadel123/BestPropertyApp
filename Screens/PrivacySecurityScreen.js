import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; // 👈 Import Theme

export default function PrivacySecurityScreen({ navigation }) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const borderColor = isDarkMode ? '#444' : '#eee';
  const iconColor = isDarkMode ? '#fff' : '#333';

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <SettingItem
        icon="shield-checkmark-outline"
        label="Data Sharing Preferences"
        onPress={() => console.log('Open Data Sharing Preferences')}
        iconColor={iconColor}
        textColor={textColor}
        borderColor={borderColor}
      />

      <SettingItem
        icon="lock-closed-outline"
        label="Password Management"
        onPress={() => console.log('Open Password Management')}
        iconColor={iconColor}
        textColor={textColor}
        borderColor={borderColor}
      />

      <SettingItem
        icon="key-outline"
        label="Security Settings"
        onPress={() => console.log('Open Security Settings')}
        iconColor={iconColor}
        textColor={textColor}
        borderColor={borderColor}
      />
    </ScrollView>
  );
}

function SettingItem({ icon, label, onPress, iconColor, textColor, borderColor }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, { borderBottomColor: borderColor }]}>
      <View style={styles.left}>
        <Ionicons name={icon} size={22} color={iconColor} />
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={iconColor} />
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
});
