import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  Feather,
  Entypo,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 3 - 20;

const dashboardItems = [
  {
    id: '1',
    title: 'Calling',
    description: 'Queue',
    icon: <Ionicons name="list-circle" size={26} color="#2980b9" />,
    screen: 'CallingQueueScreen',
  },
  {
    id: '2',
    title: 'Auto Dialer',
    description: 'with Scripts',
    icon: <FontAwesome5 name="phone-alt" size={24} color="#27ae60" />,
    screen: 'AutoDialerScreen',
  },
  {
    id: '3',
    title: 'Lead Panel',
    description: 'Qualification',
    icon: <MaterialIcons name="assignment-turned-in" size={26} color="#f39c12" />,
    screen: 'LeadQualificationPanelScreen',
  },
  {
    id: '4',
    title: 'AI Suggests',
    description: 'Next Call',
    icon: <Ionicons name="bulb" size={26} color="#8e44ad" />,
    screen: 'NextCallSuggestionsScreen',
  },
  {
    id: '5',
    title: 'Report',
    description: 'Submission',
    icon: <Feather name="file-text" size={24} color="#e74c3c" />,
    screen: 'TelecallerReportScreen',
  },
  {
    id: '6',
    title: 'Tasks',
    description: 'Assigned to You',
    icon: <Feather name="check-square" size={24} color="#16a085" />,
    screen: 'ReceivedTasksScreen',
  },
  {
    id: '7',
    title: 'Alerts',
    description: 'Notifications',
    icon: <Entypo name="notification" size={24} color="#d35400" />,
    screen: 'TelecallerNotificationsScreen',
  },
];

export default function TelecallerDashboard() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <FlatList
        data={dashboardItems}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.icon}>{item.icon}</View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f9fc',
    paddingTop: 13,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2c3e50',
  },
  grid: {
    paddingHorizontal: 4,
    paddingBottom: 40,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 5,
    margin: 3,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#34495e',
    textAlign: 'center',
  },
  description: {
    fontSize: 11,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 2,
  },
});



