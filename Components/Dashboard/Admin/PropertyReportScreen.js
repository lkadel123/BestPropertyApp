import  { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  Dimensions,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';

const statusOptions = ['Pending', 'Verified', 'Disqualified', 'Sold'];
const sortOptions = [
  { label: 'Title (A-Z)', value: 'title_asc' },
  { label: 'Title (Z-A)', value: 'title_desc' },
  { label: 'Status', value: 'status' },
  { label: 'Newest', value: 'timestamp_desc' },
  { label: 'Oldest', value: 'timestamp_asc' },
];

export default function PropertyReportScreen() {
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title_asc');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRelatedLeads, setShowRelatedLeads] = useState(false);

  const getTimeRange = (period) => {
    const now = Date.now();
    switch (period.toLowerCase()) {
      case 'day':
        return now - 24 * 60 * 60 * 1000;
      case 'week':
        return now - 7 * 24 * 60 * 60 * 1000;
      case 'month':
        return now - 30 * 24 * 60 * 1000;
      default:
        return 0;
    }
  };

  useEffect(() => {
    try {
      const mockProperties = require('../../../assets/Data/Properties.json');
      const leadsData = require('../../../assets/Data/Leads.json');
      if (!Array.isArray(mockProperties) || mockProperties.length === 0) {
        throw new Error('Properties.json is empty or invalid');
      }
      if (!Array.isArray(leadsData)) {
        throw new Error('Leads.json is empty or invalid');
      }
      setProperties(mockProperties);
      setLeads(leadsData);
      setError(null);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load properties or leads data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredProperties = useMemo(() => {
    let filtered = properties.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
      const timeThreshold = getTimeRange(timeFilter);
      const matchesTime = timeFilter === 'all' || p.timestamp >= timeThreshold;
      return matchesSearch && matchesStatus && matchesTime;
    });

    switch (sortBy) {
      case 'title_asc':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'title_desc':
        return filtered.sort((a, b) => b.title.localeCompare(a.title));
      case 'status':
        return filtered.sort((a, b) => a.status.localeCompare(b.status));
      case 'timestamp_desc':
        return filtered.sort((a, b) => b.timestamp - a.timestamp);
      case 'timestamp_asc':
        return filtered.sort((a, b) => a.timestamp - b.timestamp);
      default:
        return filtered;
    }
  }, [properties, search, selectedStatus, timeFilter, sortBy]);

  const updateStatus = (id, newStatus) => {
    if (!statusOptions.includes(newStatus)) {
      Alert.alert('Error', 'Invalid status selected.', [{ text: 'OK' }]);
      return;
    }
    const updated = properties.map((p) => {
      if (p.id === id) {
        if (newStatus === 'Verified') {
          Alert.alert(
            'Verification Success',
            `Verification message sent to ${p.owner}.\nNotification sent to related leads.`,
            [{ text: 'OK' }]
          );
        }
        return { ...p, status: newStatus };
      }
      return p;
    });
    setProperties(updated);
  };

  const bulkUpdateStatus = (newStatus) => {
    if (!statusOptions.includes(newStatus)) {
      Alert.alert('Error', 'Invalid status selected.', [{ text: 'OK' }]);
      return;
    }
    if (selectedProperties.length === 0) {
      Alert.alert('Error', 'No properties selected.', [{ text: 'OK' }]);
      return;
    }
    const updated = properties.map((p) => {
      if (selectedProperties.includes(p.id)) {
        if (newStatus === 'Verified') {
          Alert.alert(
            'Verification Success',
            `Verification message sent to ${p.owner}.\nNotification sent to related leads.`,
            [{ text: 'OK' }]
          );
        }
        return { ...p, status: newStatus };
      }
      return p;
    });
    setProperties(updated);
    setSelectedProperties([]);
  };

  const exportToCSV = async () => {
    try {
      const csvContent = [
        'ID,Title,Category,Status,Location,Owner,Agent,Contact,Price',
        ...filteredProperties.map(
          (p) =>
            `${p.id},"${p.title}","${p.category}","${p.status}","${p.location}","${p.owner}","${p.agent}","${p.contact}",${p.price || 'N/A'}`
        ),
      ].join('\n');
      const filePath = `${FileSystem.documentDirectory}properties_export_${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(filePath, csvContent);
      await Sharing.shareAsync(filePath, { mimeType: 'text/csv', dialogTitle: 'Export Properties' });
      Alert.alert('Success', 'Properties exported successfully.', [{ text: 'OK' }]);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      Alert.alert('Error', 'Failed to export properties.', [{ text: 'OK' }]);
    }
  };

  const handleCall = async (contact) => {
    if (!/^\d{10}$/.test(contact)) {
      Alert.alert('Error', 'Invalid phone number.', [{ text: 'OK' }]);
      return;
    }
    try {
      const supported = await Linking.canOpenURL(`tel:${contact}`);
      if (supported) {
        await Linking.openURL(`tel:${contact}`);
      } else {
        Alert.alert('Error', 'Unable to make a call on this device.', [{ text: 'OK' }]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate call.', [{ text: 'OK' }]);
    }
  };

  const handleMessage = async (contact) => {
    if (!/^\d{10}$/.test(contact)) {
      Alert.alert('Error', 'Invalid phone number.', [{ text: 'OK' }]);
      return;
    }
    try {
      const supported = await Linking.canOpenURL(`sms:${contact}`);
      if (supported) {
        await Linking.openURL(`sms:${contact}`);
      } else {
        Alert.alert('Error', 'Unable to send message on this device.', [{ text: 'OK' }]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate message.', [{ text: 'OK' }]);
    }
  };

  const togglePropertySelection = (id) => {
    setSelectedProperties((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const pieData = useMemo(() => {
    const statusCounts = filteredProperties.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    const total = filteredProperties.length;
    return Object.entries(statusCounts).map(([key, value], index) => ({
      name: `${key} (${total ? ((value / total) * 100).toFixed(1) : 0}%)`,
      population: value,
      color: ['#4caf50', '#f39c12', '#c0392b', '#3498db'][index % 4],
      legendFontColor: '#1f2937',
      legendFontSize: 9,
    }));
  }, [filteredProperties]);

  const PropertyCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, selectedProperties.includes(item.id) && styles.cardSelected]}
      onPress={() => setSelectedProperty(item)}
      onLongPress={() => togglePropertySelection(item.id)}
      accessibilityLabel={`Property: ${item.title}`}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        accessibilityLabel={`Image of ${item.title}`}
      />
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>📦 {item.category}</Text>
        <Text style={styles.status}>
          Status:{' '}
          <Text
            style={{
              color:
                item.status === 'Verified'
                  ? '#4caf50'
                  : item.status === 'Pending'
                  ? '#f39c12'
                  : item.status === 'Sold'
                  ? '#3498db'
                  : '#c0392b',
              fontWeight: '600',
            }}
          >
            {item.status}
          </Text>
        </Text>
        <Text style={styles.price}>
          Price: ₹{item.price ? item.price.toLocaleString('en-IN') : 'N/A'}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => setSelectedProperty(item)}
        accessibilityLabel={`Edit ${item.title}`}
      >
        <Feather name="edit" size={22} color="#2980b9" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.filterContainer}>
<View style={styles.filterRow}>
  <TextInput
    style={styles.searchInput}
    placeholder="Search by title or category"
    placeholderTextColor="#555"
    value={search}
    onChangeText={(text) => {
      if (text.length <= 100) setSearch(text);
      else Alert.alert('Error', 'Search input too long.', [{ text: 'OK' }]);
    }}
    accessibilityLabel="Search properties"
  />

<View style={styles.pickerWrapper}>
  <Picker
    selectedValue={selectedStatus}
    onValueChange={setSelectedStatus}
    style={styles.customPicker}
    dropdownIconColor="#555" // Works only on some versions (Android-specific)
  >
    <Picker.Item label="All Statuses" value="All" />
    {statusOptions.map((status) => (
      <Picker.Item key={status} label={status} value={status} />
    ))}
  </Picker>
</View>
</View>
        <View style={styles.timeFilterContainer}>
          {['day', 'week', 'month', 'all'].map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setTimeFilter(period)}
              style={[
                styles.timeFilterButton,
                timeFilter === period && styles.timeFilterButtonActive,
              ]}
              accessibilityLabel={`Filter by ${period}`}
            >
              <Text
                style={[
                  styles.timeFilterText,
                  timeFilter === period && styles.timeFilterTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={exportToCSV}
            accessibilityLabel="Export properties to CSV"
          >
            <Text style={styles.exportButtonText}>Export to CSV</Text>
          </TouchableOpacity>
          {selectedProperties.length > 0 && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue=""
                onValueChange={(value) => value && bulkUpdateStatus(value)}
                style={styles.picker}
                accessibilityLabel="Bulk update status"
              >
                <Picker.Item label="Bulk Update Status" value="" />
                {statusOptions.map((status) => (
                  <Picker.Item key={status} label={status} value={status} />
                ))}
              </Picker>
            </View>
          )}
        </View>
      </View>

      <PieChart
        data={pieData}
        width={Dimensions.get('window').width - 22}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="6"
        center={[10, 0]}
        absolute
        hasLegend={true}
        style={styles.pieChart}
        accessibilityLabel="Property status distribution chart"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading properties...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PropertyCard item={item} />}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={<Text style={styles.emptyText}>No properties found</Text>}
          contentContainerStyle={styles.flatListContent}
          accessibilityLabel="List of properties"
        />
      )}
      <Modal visible={!!selectedProperty} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setSelectedProperty(null)}
              style={styles.closeButton}
              accessibilityLabel="Close property details"
            >
              <Ionicons name="close-circle" size={28} color="#c0392b" />
            </TouchableOpacity>
            {selectedProperty && (
<View style={styles.detailCard}>

  {/* Property Image */}
  <Image
    source={{ uri: selectedProperty.image }}
    style={styles.largeImage}
    accessibilityLabel={`Image of ${selectedProperty.title}`}
  />

  {/* Title + Location */}
  <Text style={styles.modalTitle}>{selectedProperty.title}</Text>
  <Text style={styles.modalSub}>📍 {selectedProperty.location}</Text>

  {/* Property Meta Info */}
  <View style={styles.infoGroup}>
    <Text style={styles.modalText}>📦 Category: {selectedProperty.category}</Text>
    <Text style={styles.modalText}>🏷️ Status: {selectedProperty.status}</Text>
    <Text style={styles.modalText}>
      💰 Price: ₹{selectedProperty.price?.toLocaleString('en-IN') || 'N/A'}
    </Text>
  </View>

  {/* Owner Info */}
  <View style={styles.profileSection}>
    <Image
      source={{ uri: selectedProperty.ownerImage }}
      style={styles.profileImage}
      defaultSource={{ uri: 'https://via.placeholder.com/50' }}
    />
    <View>
      <Text style={styles.profileLabel}>Owner</Text>
      <Text style={styles.modalText}>{selectedProperty.owner}</Text>
    </View>
  </View>

  {/* Agent Info */}
  <View style={styles.profileSection}>
    <Image
      source={{ uri: selectedProperty.agentImage }}
      style={styles.profileImage}
      defaultSource={{ uri: 'https://via.placeholder.com/50' }}
    />
    <View>
      <Text style={styles.profileLabel}>Agent</Text>
      <Text style={styles.modalText}>{selectedProperty.agent}</Text>
    </View>
  </View>

  {/* Contact & Actions */}
  <Text style={styles.modalText}>📞 Contact: {selectedProperty.contact}</Text>
  <View style={styles.actionContainer}>
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: '#10b981' }]}
      onPress={() => handleCall(selectedProperty.contact)}
    >
      <Ionicons name="call" size={20} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
      onPress={() => handleMessage(selectedProperty.contact)}
    >
      <MaterialIcons name="message" size={20} color="#fff" />
    </TouchableOpacity>
  </View>

  {/* Related Leads */}
  {selectedProperty.relatedLeadIds.length > 0 && (
    <>
      <TouchableOpacity
        style={styles.relatedLeadsToggle}
        onPress={() => setShowRelatedLeads(!showRelatedLeads)}
      >
        <Text style={styles.modalSubTitle}>
          Related Leads {showRelatedLeads ? '▼' : '▶'}
        </Text>
      </TouchableOpacity>

      {showRelatedLeads &&
        selectedProperty.relatedLeadIds.map((leadId) => {
          const lead = leads.find((l) => l.id === leadId);
          return lead ? (
            <TouchableOpacity
              key={leadId}
              style={styles.leadCard}
              onPress={() =>
                navigation.navigate('LeadStatusOverview', {
                  selectedLead: lead,
                })
              }
            >
              <Image
                source={{ uri: lead.imageUrl }}
                style={styles.leadImage}
                defaultSource={{ uri: 'https://via.placeholder.com/40' }}
              />
              <View>
                <Text style={styles.leadName}>{lead.name}</Text>
                <Text style={styles.leadSub}>Status: {lead.status}</Text>
                <Text style={styles.leadSub}>Email: {lead.email}</Text>
              </View>
            </TouchableOpacity>
          ) : null;
        })}
    </>
  )}

  {/* Status Change Section */}
  <Text style={styles.modalSubTitle}>Change Status</Text>
  <View style={styles.statusButtonContainer}>
    {statusOptions.map((status) => (
      <TouchableOpacity
        key={status}
        style={[
          styles.statusButton,
          {
            backgroundColor:
              selectedProperty.status === status ? '#6b7280' : '#3498db',
          },
        ]}
        onPress={() => {
          updateStatus(selectedProperty.id, status);
          setSelectedProperty({ ...selectedProperty, status });
        }}
      >
        <Text style={styles.statusButtonText}>{status}</Text>
      </TouchableOpacity>
    ))}
  </View>
</View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  filterRow: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  pickerWrapper: {
    width: 140,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
customPickerWrapper: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  position: 'relative',
  overflow: 'hidden',
  justifyContent: 'center',
},

customPicker: {
  height: 50,
  width: '100%',
  color: '#555',
  paddingRight: 30, 
},

pickerIcon: {
  position: 'absolute',
  right: 10,
  top: '50%',
  marginTop: -12, 
  pointerEvents: 'none',
},
  timeFilterContainer: {
    margin:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    marginBottom: 12,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  timeFilterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  timeFilterText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  timeFilterTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    backgroundColor: '#10b981',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  exportButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  pieChart: {
    margin: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    padding: 2,
    elevation: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  category: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: '#ffffff',
    margin: 10,
    borderRadius: 12,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    margin: 0,
    marginBottom: 15,
    elevation: 4,
  },
  largeImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 3,
    color: '#1f2937',
  },
  modalSub: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  infoGroup: {
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#374151',
    marginVertical: 2,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 10,
  },
  relatedLeadsToggle: {
    marginTop: 10,
  },
  modalSubTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 6,
  },
  leadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  leadImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  leadName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  leadSub: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#c0392b',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
  },
  flatListContent: {
    paddingBottom: 100,
  },
});