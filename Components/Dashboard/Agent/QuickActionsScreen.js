import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { Ionicons, Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function QuickActionsScreen({ navigation }) {
  const phoneNumber = '+919999999999'; // Dummy lead number

  const handleCallLead = () => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() =>
      Alert.alert('Error', 'Calling not supported on this device')
    );
  };

  const handleWhatsApp = () => {
    const url = `whatsapp://send?phone=${phoneNumber}&text=Hi, I'm following up on your property inquiry.`;
    Linking.openURL(url).catch(() =>
      Alert.alert('WhatsApp not installed', 'Please install WhatsApp to use this feature.')
    );
  };

  const handleChangeStatus = () => {
    Alert.alert('Change Status', 'Open lead status modal here');
    // navigation.navigate('ChangeLeadStatusScreen');
  };

  const handleAddProperty = () => {
    Alert.alert('Navigation', 'Navigate to AddPropertyScreen');
    // navigation.navigate('AddPropertyScreen');
  };

  const handleQuickNote = () => {
    Alert.prompt(
      'Quick Note',
      'Add a quick note for this lead',
      (text) => Alert.alert('Saved Note', `"${text}" saved (mock)`),
      'plain-text'
    );
  };

  const actions = [
    {
      id: '1',
      label: 'Call Lead',
      icon: <Ionicons name="call" size={24} color="#2ecc71" />,
      onPress: handleCallLead,
    },
    {
      id: '2',
      label: 'WhatsApp Lead',
      icon: <Ionicons name="logo-whatsapp" size={24} color="#27ae60" />,
      onPress: handleWhatsApp,
    },
    {
      id: '3',
      label: 'Change Lead Status',
      icon: <MaterialIcons name="autorenew" size={24} color="#f39c12" />,
      onPress: handleChangeStatus,
    },
    {
      id: '4',
      label: 'Add New Property',
      icon: <Feather name="plus-square" size={24} color="#3498db" />,
      onPress: handleAddProperty,
    },
    {
      id: '5',
      label: 'Add Quick Note',
      icon: <FontAwesome5 name="sticky-note" size={22} color="#9b59b6" />,
      onPress: handleQuickNote,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.actionGrid}>
        {actions.map((action) => (
          <TouchableOpacity key={action.id} style={styles.card} onPress={action.onPress}>
            <View style={styles.icon}>{action.icon}</View>
            <Text style={styles.label}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6f8',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2c3e50',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
