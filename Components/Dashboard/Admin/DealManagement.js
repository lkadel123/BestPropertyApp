import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CreateDealModal from './Deals/CreateDealModal'; // ✅ Adjust path as necessary

const DealsDashboard = () => {
  const navigation = useNavigation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const items = [
    {
      id: '1',
      title: 'Create Deal',
      icon: <Ionicons name="add-circle-outline" size={24} color="#27ae60" />,
      onPress: () => setShowCreateModal(true),
    },
    {
      id: '2',
      title: 'Deal List',
      icon: <FontAwesome5 name="list-ul" size={24} color="#2980b9" />,
      onPress: () =>
        navigation.navigate('Deals', {
          screen: 'DealList',
        }),
    },
    {
      id: '3',
      title: 'Deals Reports',
      icon: <MaterialIcons name="bar-chart" size={24} color="#f39c12" />,
      onPress: () =>
        navigation.navigate('Deals', {
          screen: 'DealsReports',
        }),
    },
    {
      id: '4',
      title: 'Edit Deal',
      icon: <Ionicons name="create-outline" size={24} color="#8e44ad" />,
      onPress: () =>
        navigation.navigate('Deals', {
          screen: 'EditDeal',
        }),
    },
    {
      id: '5',
      title: 'Deal Status Board',
      icon: <FontAwesome5 name="project-diagram" size={24} color="#e67e22" />,
      onPress: () =>
        navigation.navigate('Deals', {
          screen: 'DealStatusBoard',
        }),
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={item.onPress}>
      <View style={styles.cardContent}>
        {item.icon}
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* ✅ Create Deal Modal */}
      <CreateDealModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={(newDeal) => {
          console.log('✅ Deal Created:', newDeal);
          setShowCreateModal(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DealsDashboard;




