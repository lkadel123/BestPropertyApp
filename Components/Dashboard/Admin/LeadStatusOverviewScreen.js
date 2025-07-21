import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';
import LeadCard from './LeadStatus/LeadCard';
import LeadModal from './LeadStatus/LeadModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from 'lodash'; // Ensure lodash is installed: npm install lodash
import leadViewPermissions from '../../../assets/Data/RoleBasedLeadPermissions.json';
import leadUpdatePermissions from '../../../assets/Data/LeadUpdatePermissions.json';

// Valid statuses for validation
const validStatuses = [
  'New Leads',
  'Contacted',
  'Qualified',
  'Site Visits',
  'Negotiation',
  'Booking Confirmed',
  'Document Collection',
  'Loan Under Process',
  'Finalized / Closed',
  'Follow-up',
  'Not negotiated',
  'Not Interested',
  'Duplicate',
  'Invalid Lead',
  'Pending',
];

export default function LeadStatusOverviewScreen({ route, navigation }) {
  const { user, userToken } = useContext(AuthContext);
  const [selectedStatus, setSelectedStatus] = useState(route?.params?.selectedStatus || 'All');
  const [timeFilter, setTimeFilter] = useState(route?.params?.timeFilter || 'all');
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [storedata, setStoreData] = useState({ phone: '', person: '' });
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = () => !!userToken && !!user;
  const nav = useNavigation();

  // Hardcoded role and userId as per the provided fetchLeads
  const role = 'admin';
  const userId = 1;

  // Debounce search input to avoid frequent updates
  const debouncedSearch = useMemo(() => debounce(setSearch, 300), []);

  // Derive status definitions from fetched leads, filtered by role-based permissions
  const statusDefinitions = useMemo(() => {
    const userRole = isLoggedIn() ? user?.role : null;
    const allowedStatuses = userRole && leadViewPermissions[userRole]
      ? leadViewPermissions[userRole]
      : validStatuses;

    const statusMap = new Map();
    leads.forEach((lead) => {
      if (validStatuses.includes(lead.status) && !statusMap.has(lead.status)) {
        statusMap.set(lead.status, '❓');
      } else if (!validStatuses.includes(lead.status) && __DEV__) {
        console.warn(`Invalid status found in API response: ${lead.status}`);
      }
    });

    const statuses = Array.from(statusMap.entries())
      .map(([title, icon]) => ({ title, icon }))
      .filter((def) => allowedStatuses.includes(def.title))
      .sort((a, b) => a.title.localeCompare(b.title));

    if (__DEV__) {
      console.log(`Status definitions for role ${userRole || 'unauthorized'}:`, statuses);
    }
    return statuses;
  }, [leads, user, userToken]);

  const allowedUpdateStatuses = useMemo(() => {
    const userRole = isLoggedIn() ? user?.role : null;
    if (userRole && !leadUpdatePermissions[userRole]) {
      if (__DEV__) console.warn(`No update permissions for role: ${userRole}`);
      return [];
    }
    const statuses = userRole && leadUpdatePermissions[userRole]
      ? leadUpdatePermissions[userRole].filter((status) => validStatuses.includes(status))
      : [];
    if (__DEV__) console.log(`Allowed update statuses for role ${userRole || 'unauthorized'}:`, statuses);
    return statuses;
  }, [user, userToken]);

  const getTimeRange = (period) => {
    const now = Date.now();
    let threshold;
    switch (period.toLowerCase()) {
      case 'day':
        threshold = now - 24 * 60 * 60 * 1000;
        break;
      case 'week':
        threshold = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case 'month':
        threshold = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case 'all':
        threshold = 0;
        break;
      default:
        if (__DEV__) console.warn(`Invalid time filter: ${period}`);
        threshold = 0;
    }
    if (__DEV__) console.log(`Time filter ${period}: threshold = ${threshold} (${new Date(threshold).toISOString()})`);
    return threshold;
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    setError(null);

    if (!isLoggedIn() && !validateUserData()) {
      setError('Please enter valid phone and name to view leads.');
      setIsLoading(false);
      return;
    }

    try {
      const userRole = isLoggedIn() ? user?.role : null;
      const allowedStatuses = userRole && leadViewPermissions[userRole]
        ? leadViewPermissions[userRole]
        : validStatuses;

      if (userRole && !leadViewPermissions[userRole]) {
        if (__DEV__) console.warn(`Invalid role: ${userRole}`);
        setError('Invalid user role. Please contact support.');
        setIsLoading(false);
        return;
      }

      const url = `https://bestpropertiesmohali.com/api/Leads/get/?Role=Admin&Userid=1|`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer 9j1h8hgjO0KUin2bhj58d97jiOh67f5h48hj78hg8vg5j63fo0h930`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (__DEV__) console.log('Leads:', data);

      if (data.status !== 'success' || !Array.isArray(data.result.leads)) {
        throw new Error('Invalid API response format');
      }

      const validLeads = data.result.leads
        .map((lead) => {
          const timestamp = lead.rDate ? new Date(lead.rDate).getTime() : Date.now();

          if (!Number.isFinite(timestamp)) {
            if (__DEV__) console.warn(`Invalid timestamp for lead ${lead.id}: ${lead.rDate}`);
            return null;
          }

          if (!validStatuses.includes(lead.status)) {
            if (__DEV__) console.warn(`Skipping lead ${lead.id} with invalid status: ${lead.status}`);
            return null;
          }

          return {
            ...lead,
            name: lead.uName || 'Unknown',
            timestamp,
          };
        })
        .filter((lead) => lead !== null && allowedStatuses.includes(lead.status));

      if (__DEV__) {
        console.log(`Role-based filter: Loaded ${validLeads.length} leads for role ${userRole || 'unauthorized'}`);
        console.log('Lead timestamps:', validLeads.map(lead => ({ id: lead.id, status: lead.status, timestamp: lead.timestamp })));
      }

      setLeads(validLeads);
      await AsyncStorage.setItem('cached_leads', JSON.stringify(validLeads)); // Cache leads
      setError(null);
    } catch (error) {
      if (__DEV__) console.error('Fetch error:', error.message);
      setError('Failed to load leads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load cached leads and fetch fresh data in background
  useEffect(() => {
    const loadData = async () => {
      try {
        const cached = await AsyncStorage.getItem('cached_leads');
        if (cached) {
          setLeads(JSON.parse(cached));
        }
      } catch (error) {
        if (__DEV__) console.error('Error loading cached leads:', error.message);
      }
      fetchLeads(); // Refresh in background
    };
    loadData();
  }, [user, userToken]);

  const handleStatusUpdate = useCallback((updatedLead) => {
    if (!allowedUpdateStatuses.includes(updatedLead.status)) {
      if (__DEV__) console.warn(`Unauthorized status update for lead ${updatedLead.id}: ${updatedLead.status}`);
      Alert.alert('Error', 'You are not authorized to set this status.');
      return;
    }
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === updatedLead.id
          ? { ...lead, status: updatedLead.status, rating: updatedLead.rating, timestamp: Date.now(), icon: updatedLead.icon }
          : lead
      )
    );
    setSelectedLead(updatedLead);
    if (__DEV__) console.log(`Lead ${updatedLead.id} updated: status=${updatedLead.status}, rating=${updatedLead.rating}, timestamp=${Date.now()}, icon=${updatedLead.icon}`);
  }, [allowedUpdateStatuses]);

  // Optimized filteredLeads calculation
  const filteredLeads = useMemo(() => {
    const timeThreshold = getTimeRange(timeFilter);

    const filtered = leads.filter((lead) => {
      const statusMatch =
        selectedStatus === 'All' ||
        lead.status?.toLowerCase() === selectedStatus.toLowerCase();

      const timeMatch =
        timeFilter === 'all' ||
        (Number.isFinite(lead.timestamp) && lead.timestamp >= timeThreshold);

      const searchMatch = !search || lead.name?.toLowerCase().includes(search.toLowerCase());

      return statusMatch && timeMatch && searchMatch;
    });

    if (__DEV__) {
      console.log(`Filtered ${filtered.length} leads for status=${selectedStatus}, timeFilter=${timeFilter}, search=${search}`);
    }
    return filtered;
  }, [leads, selectedStatus, search, timeFilter]);

  const handleLeadPress = useCallback((lead) => setSelectedLead(lead), []);
  const closeModal = useCallback(() => setSelectedLead(null), []);

  const handleCall = useCallback(async (phone) => {
    try {
      const supported = await Linking.canOpenURL(`tel:${phone}`);
      if (supported) await Linking.openURL(`tel:${phone}`);
      else Alert.alert('Error', 'Unable to make a call on this device');
    } catch {
      Alert.alert('Error', 'Failed to initiate call');
    }
  }, []);

  const handleMessage = useCallback(async (phone) => {
    try {
      const supported = await Linking.canOpenURL(`sms:${phone}`);
      if (supported) await Linking.openURL(`sms:${phone}`);
      else Alert.alert('Error', 'Unable to send message on this device');
    } catch {
      Alert.alert('Error', 'Failed to initiate message');
    }
  }, []);

  const handleNotification = useCallback((name) => {
    Alert.alert('Notification', `Notification sent to ${name}`);
  }, []);

  const handleMeeting = useCallback((lead) => {
    navigation.navigate('MeetingsStack', {
      screen: 'MeetingModal',
      params: { lead },
    });
  }, [navigation]);

  const handleNewData = useCallback((name, value) => {
    setStoreData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateUserData = useCallback(() => {
    if (isLoggedIn()) return true;
    const errors = [];
    if (!storedata.phone || !/^\d{10}$/.test(storedata.phone)) {
      errors.push('Please enter a valid 10-digit phone number.');
    }
    if (!storedata.person) {
      errors.push('Please enter your name.');
    }
    if (errors.length > 0) {
      setError(errors.join(' '));
      return false;
    }
    return true;
  }, [storedata, isLoggedIn]);

  const handleRetry = useCallback(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddLeadsModal')}
          style={styles.headerButton}
        >
          <Ionicons name="person-add" size={20} color="#fff" />
          <Text style={styles.headerButtonText}>Add</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Memoized renderItem for FlatList
  const renderItem = useCallback(
    ({ item }) => (
      <LeadCard
        item={item}
        handleLeadPress={handleLeadPress}
        handleCall={handleCall}
        handleMeeting={handleMeeting}
      />
    ),
    [handleLeadPress, handleCall, handleMeeting]
  );

  const renderFilters = useCallback(() => (
    <View style={styles.filterContainer}>
      {!isLoggedIn() && (
        <>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Phone Number <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={storedata.phone}
              onChangeText={(value) => handleNewData('phone', value)}
              placeholder="Enter 10-digit phone number"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={storedata.person}
              onChangeText={(value) => handleNewData('person', value)}
              placeholder="Enter your name"
            />
          </View>
        </>
      )}
      <View style={styles.searchPickerContainer}>
        <TextInput
          placeholder="Search leads by name..."
          placeholderTextColor="#555"
          style={styles.searchInput}
          onChangeText={debouncedSearch} // Use debounced search
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(itemValue) => setSelectedStatus(itemValue)}
            style={styles.picker}
            dropdownIconColor="#000"
            mode="dropdown"
          >
            <Picker.Item label="All Statuses" value="All" />
            {statusDefinitions.map((status) => (
              <Picker.Item key={status.title} label={status.title} value={status.title} />
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
    </View>
  ), [isLoggedIn, storedata, handleNewData, selectedStatus, timeFilter, statusDefinitions, debouncedSearch]);

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading leads...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredLeads}
          keyExtractor={(item) => item.id?.toString()}
          ListHeaderComponent={renderFilters}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No leads found</Text>}
          initialNumToRender={10} // Render fewer items initially
          maxToRenderPerBatch={10} // Batch rendering
          windowSize={5} // Reduce offscreen rendering
          removeClippedSubviews={true} // Clip offscreen items
          updateCellsBatchingPeriod={50} // Smoother batch updates
          getItemLayout={(data, index) => ({
            length: 100,
            offset: 100 * index,
            index,
          })}
        />
      )}
      <LeadModal
        visible={!!selectedLead}
        lead={selectedLead}
        onClose={closeModal}
        onCall={handleCall}
        onMessage={handleMessage}
        onNotify={handleNotification}
        onMeeting={handleMeeting}
        onStatusUpdate={handleStatusUpdate}
        allowedStatuses={allowedUpdateStatuses}
        userRole={role}
      />
    </View>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F5',
    paddingHorizontal: 8,
  },
  filterContainer: {
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    marginHorizontal: 4,
    marginTop: 10,
  },
  searchPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 16,
    color: '#555',
    marginRight: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    width: 150,
    height: 50,
    color: '#555',
    fontSize: 12,
    backgroundColor: '#fff',
  },
  timeFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  timeFilterButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  timeFilterText: {
    fontSize: 14,
    color: '#333',
  },
  timeFilterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#666',
  },
  fieldContainer: {
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#dc3545',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  headerButton: {
    flexDirection: 'row',
    backgroundColor: '#10b981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
});