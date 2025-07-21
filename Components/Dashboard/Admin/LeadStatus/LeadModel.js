import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  FlatList,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import PropTypes from 'prop-types';
import { useCallRecordingService } from '../../../../Services/CallRecordingService';

// Ensure @react-native-masked-view/masked-view is installed to resolve potential RNCMaskedView error:
// npm install @react-native-masked-view/masked-view@^0.3.1
// npx react-native link @react-native-masked-view/masked-view
// For iOS: cd ios && pod install
// For Android: cd android && ./gradlew clean
// Check LeadCard or useCallRecordingService for MaskedView or LinearGradient usage.

// API Constants
const API_BASE_URL = 'https://bestpropertiesmohali.com/api/Leads';
const API_TOKEN = '9j1h8hgjO0KUin2bhj58d97jiOh67f5h48hj78hg8vg5j63fo0h930'; // Replace with your actual token or auth mechanism

// VoiceNoteSection Component
function VoiceNoteSection({ hasPermission, recording, recordings, stopRecording, playRecording }) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Call Recording</Text>
      {!hasPermission && (
        <Text style={styles.errorText}>
          Call recording is disabled. Please grant microphone and media permissions in settings.
        </Text>
      )}
      {recording && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={stopRecording}
          disabled={!hasPermission}
          accessibilityLabel="Stop call recording"
        >
          <Ionicons name="stop-circle" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Stop Recording</Text>
        </TouchableOpacity>
      )}
      {recordings?.length > 0 && (
        <View style={styles.voiceNoteList}>
          {recordings.slice(0, 3).map((asset, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => playRecording({ uri: asset.uri })}
              style={styles.playButton}
              accessibilityLabel={`Play recording from ${new Date(asset.creationTime).toLocaleString('en-IN')}`}
            >
              <Ionicons name="play-circle" size={16} color="#2563eb" />
              <Text style={styles.playText}>
                Play {new Date(asset.creationTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

VoiceNoteSection.propTypes = {
  hasPermission: PropTypes.bool,
  recording: PropTypes.bool,
  recordings: PropTypes.array,
  stopRecording: PropTypes.func,
  playRecording: PropTypes.func,
};

// LeadModal Component
export default function LeadModal({
  visible,
  lead,
  onClose,
  onCall,
  onIncomingCall,
  onMessage,
  onNotify,
  onMeeting,
  onStatusUpdate,
  onUpdateLead,
  onDeleteLead,
  allowedStatuses,
  userRole,
}) {
  const [selectedStatus, setSelectedStatus] = useState(lead?.status || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState(lead || {});
  const {
    hasPermission,
    recording,
    recordings,
    callHistory,
    isRecordingLoading,
    stopRecording,
    playRecording,
    handleOutgoingCall,
    handleIncomingCall,
  } = useCallRecordingService(lead?.mobile, onCall, onIncomingCall);

  const getStatusIcon = (timestamp) => {
    const now = Date.now();
    const dayThreshold = now - 24 * 60 * 60 * 1000;
    const weekThreshold = now - 7 * 24 * 60 * 60 * 1000;
    if (timestamp >= dayThreshold) return '🔥';
    if (timestamp >= weekThreshold) return '🔄';
    return '❌';
  };

  const handleStatusChange = (newStatus) => {
    if (!newStatus || newStatus === selectedStatus) return;
    if (!allowedStatuses.includes(newStatus)) {
      Alert.alert('Error', 'You are not authorized to set this status.');
      return;
    }
    setSelectedStatus(newStatus);
    const newTimestamp = Date.now();
    const newIcon = getStatusIcon(newTimestamp);
    const updatedLead = {
      ...lead,
      status: newStatus,
      timestamp: newTimestamp,
      icon: newIcon,
    };
    console.log(`Updating lead ${lead.id}: status=${newStatus}, timestamp=${newTimestamp}, icon=${newIcon}`);
    onStatusUpdate?.(updatedLead);
    Alert.alert('Status Updated', `Lead updated to ${newStatus} ${newIcon}`);
  };

  const handleSafeMessage = () => {
    if (!lead?.mobile) {
      Alert.alert('Error', 'No phone number available.');
      return;
    }
    onMessage?.(lead.mobile);
  };

  const handleSafeNotify = () => {
    if (!lead?.name) {
      Alert.alert('Error', 'No lead name available.');
      return;
    }
    onNotify?.(lead.name);
  };

  const handleSafeMeeting = () => {
    if (!lead) {
      Alert.alert('Error', 'No lead data available.');
      return;
    }
    onMeeting?.(lead);
  };

  const handleWhatsApp = async () => {
    if (!lead?.mobile) {
      Alert.alert('Error', 'No phone number available.');
      return;
    }
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(lead.mobile)) {
      Alert.alert('Error', 'Invalid phone number format for WhatsApp.');
      return;
    }
    const url = `https://wa.me/${lead.mobile}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'WhatsApp is not installed.');
      }
    } catch (error) {
      console.error('WhatsApp error:', error);
      Alert.alert('Error', 'Failed to open WhatsApp.');
    }
  };

  const handleUpdateLead = () => {
    if (userRole !== 'admin') {
      Alert.alert('Error', 'Only admins can update full lead details.');
      return;
    }
    setIsEditing(true);
  };

  const handleSaveUpdate = async () => {
    if (userRole !== 'admin') {
      Alert.alert('Error', 'Only admins can update full lead details.');
      return;
    }
    if (!editedLead.name || !editedLead.mobile) {
      Alert.alert('Error', 'Name and phone number are required.');
      return;
    }

    const payload = {
      uName: editedLead.name,
      mobile: editedLead.mobile,
      address: editedLead.address,
      preferred_location: editedLead.preferred_location,
      budget: editedLead.budget,
      max_budget: editedLead.max_budget,
      requirement: editedLead.requirement,
      leads_type: editedLead.leads_type,
      description: editedLead.description,
      status: editedLead.status || selectedStatus,
      city: editedLead.city,
      state: editedLead.state,
      userType: editedLead.userType,
      email: editedLead.email,
      Project_Builder: editedLead.Project_Builder,
      propertyType_sub: editedLead.propertyType_sub,
      propertyType: editedLead.propertyType,
      source: editedLead.source,
      Profession: editedLead.Profession,
      deal: editedLead.deal,
      timeline: editedLead.timeline,
      priority: editedLead.priority,
      userid: editedLead.userid,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/update/${editedLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const updatedLead = {
        ...editedLead,
        timestamp: Date.now(),
        icon: getStatusIcon(Date.now()),
      };
      onUpdateLead?.(updatedLead);
      setIsEditing(false);
      Alert.alert('Success', 'Lead details updated successfully.');
    } catch (error) {
      console.error('Update lead error:', error);
      Alert.alert('Error', `Failed to update lead: ${error.message || 'Please try again.'}`);
    }
  };

  const handleDeleteLead = () => {
    if (userRole !== 'admin') {
      Alert.alert('Error', 'Only admins can delete leads.');
      return;
    }
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this lead?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/delete/${lead.id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${API_TOKEN}`,
                },
              });

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
              }

              onDeleteLead?.(lead.id);
              onClose();
              Alert.alert('Success', 'Lead deleted successfully.');
            } catch (error) {
              console.error('Delete lead error:', error);
              Alert.alert('Error', `Failed to delete lead: ${error.message || 'Please try again.'}`);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderCallItem = ({ item }) => {
    const iconName =
      item.type === 'incoming' ? 'call' : item.type === 'outgoing' ? 'call-outline' : 'call-sharp';
    const iconColor =
      item.type === 'missed' ? '#ef4444' : item.type === 'incoming' ? '#10b981' : '#3b82f6';

    return (
      <View style={styles.callItem}>
        <Ionicons name={iconName} size={16} color={iconColor} style={styles.callIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.callTypeText}>
            {item.type.toUpperCase()} - {item.duration}
          </Text>
          <Text style={styles.callTimestamp}>
            {new Date(item.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </Text>
          {item.recording && (
            <TouchableOpacity
              onPress={() => playRecording(item.recording)}
              style={styles.playButton}
              accessibilityLabel="Play call recording"
            >
              <Ionicons name="play-circle" size={16} color="#2563eb" />
              <Text style={styles.playText}>Play Recording</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const parseAdditionalInfo = (info) => {
    try {
      return JSON.parse(info || '{}');
    } catch {
      return {};
    }
  };

  const renderField = (label, value) => {
    if (value === null || value === undefined || value === '') return null;
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}:</Text>
        <Text style={styles.fieldValue}>{value.toString()}</Text>
      </View>
    );
  };

  const renderEditableField = (label, key, value) => {
    if (value === null || value === undefined || value === '') return null;
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}:</Text>
        <TextInput
          style={styles.fieldInput}
          value={value.toString()}
          onChangeText={(text) => setEditedLead({ ...editedLead, [key]: text })}
          placeholder={`Enter ${label}`}
          accessibilityLabel={`Edit ${label}`}
        />
      </View>
    );
  };

  const additionalInfo = lead ? parseAdditionalInfo(lead.additional_info) : {};

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalView}>
        <View style={styles.modalCard}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel="Close modal"
          >
            <Ionicons name="close-circle" size={24} color="#ef4444" />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Lead Header */}
            <View style={styles.headerContainer}>
              {lead?.imageUrl && (
                <Image source={{ uri: lead.imageUrl }} style={styles.modalAvatar} />
              )}
              {isEditing ? (
                <TextInput
                  style={[styles.leadName, styles.fieldInput]}
                  value={editedLead.name}
                  onChangeText={(text) => setEditedLead({ ...editedLead, name: text })}
                  placeholder="Enter lead name"
                  accessibilityLabel="Edit lead name"
                />
              ) : (
                <Text style={styles.leadName}>{lead?.name || 'Unknown'}</Text>
              )}
              <View style={styles.statusRow}>
                <Text style={styles.leadSub}>Status: {selectedStatus || 'N/A'}</Text>
                {lead?.icon && <Text style={styles.statusIcon}>{lead.icon}</Text>}
              </View>
            </View>

            {/* Detailed Lead Information */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Lead Details</Text>
              {isEditing ? (
                <>
                  {renderEditableField('ID', 'id', editedLead.id)}
                  {renderEditableField('Email', 'email', editedLead.email)}
                  {renderEditableField('Phone', 'mobile', editedLead.mobile)}
                  {renderEditableField('Address', 'address', editedLead.address)}
                  {renderEditableField('City', 'city', editedLead.city)}
                  {renderEditableField('State', 'state', editedLead.state)}
                  {renderEditableField('Preferred Location', 'preferred_location', editedLead.preferred_location)}
                  {renderEditableField('Budget', 'budget', editedLead.budget)}
                  {renderEditableField('Max Budget', 'max_budget', editedLead.max_budget)}
                  {renderEditableField('Payment Method', 'Payment_Method', editedLead.Payment_Method)}
                  {renderEditableField('Requirement', 'requirement', editedLead.requirement)}
                  {renderEditableField('Leads Type', 'leads_type', editedLead.leads_type)}
                  {renderEditableField('Description', 'description', editedLead.description)}
                  {renderEditableField('Registered Date', 'rDate', editedLead.rDate)}
                  {renderEditableField('User Type', 'userType', editedLead.userType)}
                  {renderEditableField('Project Builder', 'Project_Builder', editedLead.Project_Builder)}
                  {renderEditableField('Property Type', 'propertyType', editedLead.propertyType)}
                  {renderEditableField('Property Sub-Type', 'propertyType_sub', editedLead.propertyType_sub)}
                  {renderEditableField('Source', 'source', editedLead.source)}
                  {renderEditableField('Profession', 'Profession', editedLead.Profession)}
                  {renderEditableField('Deal', 'deal', editedLead.deal)}
                  {renderEditableField('Timeline', 'timeline', editedLead.timeline)}
                  {renderEditableField('Priority', 'priority', editedLead.priority)}
                  {renderEditableField('User ID', 'userid', editedLead.userid)}
                </>
              ) : (
                <>
                  {renderField('ID', lead?.id)}
                  {renderField('Email', lead?.email)}
                  {renderField('Phone', lead?.mobile)}
                  {renderField('Address', lead?.address)}
                  {renderField('City', lead?.city)}
                  {renderField('State', lead?.state)}
                  {renderField('Preferred Location', lead?.preferred_location)}
                  {renderField('Budget', lead?.budget)}
                  {renderField('Max Budget', lead?.max_budget)}
                  {renderField('Payment Method', lead?.Payment_Method)}
                  {renderField('Requirement', lead?.requirement)}
                  {renderField('Leads Type', lead?.leads_type)}
                  {renderField('Description', lead?.description)}
                  {renderField('Registered Date', lead?.rDate)}
                  {renderField('User Type', lead?.userType)}
                  {renderField('Project Builder', lead?.Project_Builder)}
                  {renderField('Property Type', lead?.propertyType)}
                  {renderField('Property Sub-Type', lead?.propertyType_sub)}
                  {renderField('Source', lead?.source)}
                  {renderField('Profession', lead?.Profession)}
                  {renderField('Deal', lead?.deal)}
                  {renderField('Timeline', lead?.timeline)}
                  {renderField('Priority', lead?.priority)}
                  {renderField('User ID', lead?.userid)}
                  {renderField('Added', lead?.timestamp ? new Date(lead.timestamp).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A')}
                  {Object.keys(additionalInfo).length > 0 && (
                    <View style={styles.fieldContainer}>
                      <Text style={styles.sectionTitle}>Additional Info</Text>
                      {Object.entries(additionalInfo).map(([key, value]) => (
                        <View key={key} style={styles.fieldContainer}>
                          <Text style={styles.fieldLabel}>{key}:</Text>
                          {isEditing ? (
                            <TextInput
                              style={styles.fieldInput}
                              value={value.toString()}
                              onChangeText={(text) => {
                                const newInfo = { ...additionalInfo, [key]: text };
                                setEditedLead({ ...editedLead, additional_info: JSON.stringify(newInfo) });
                              }}
                              placeholder={`Enter ${key}`}
                              accessibilityLabel={`Edit ${key}`}
                            />
                          ) : (
                            <Text style={styles.fieldValue}>{value}</Text>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Status Update Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Update Status</Text>
              {allowedStatuses.length === 0 ? (
                <Text style={styles.errorText}>No status update permissions for your role.</Text>
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedStatus}
                    onValueChange={handleStatusChange}
                    style={styles.picker}
                    enabled={allowedStatuses.length > 0}
                    accessibilityLabel="Select lead status"
                  >
                    <Picker.Item label="Select Status" value="" />
                    {allowedStatuses.map((status) => (
                      <Picker.Item key={status} label={status} value={status} />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            {/* Call History Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Call History</Text>
              <FlatList
                data={callHistory}
                keyExtractor={(item) => item.id}
                renderItem={renderCallItem}
                scrollEnabled={false}
              />
            </View>

            {/* Call Recording Section */}
            {VoiceNoteSection && (
              <VoiceNoteSection
                hasPermission={hasPermission}
                recording={recording}
                recordings={recordings}
                stopRecording={stopRecording}
                playRecording={playRecording}
              />
            )}

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              {isEditing ? (
                <>
                  <TouchableOpacity
                    onPress={handleSaveUpdate}
                    style={[styles.actionButton, { backgroundColor: '#10b981' }]}
                    accessibilityLabel="Save lead updates"
                  >
                    <Ionicons name="save" size={20} color="#ffffff" />
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsEditing(false)}
                    style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
                    accessibilityLabel="Cancel editing"
                  >
                    <Ionicons name="close" size={20} color="#ffffff" />
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {userRole === 'admin' && (
                    <TouchableOpacity
                      onPress={handleUpdateLead}
                      style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
                      accessibilityLabel="Edit lead details"
                    >
                      <Ionicons name="pencil" size={20} color="#ffffff" />
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                  {userRole === 'admin' && (
                    <TouchableOpacity
                      onPress={handleDeleteLead}
                      style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
                      accessibilityLabel="Delete lead"
                    >
                      <Ionicons name="trash" size={20} color="#ffffff" />
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={handleOutgoingCall}
                    style={[styles.actionButton, { backgroundColor: '#10b981' }]}
                    disabled={isRecordingLoading}
                    accessibilityLabel="Make outgoing call"
                  >
                    <Ionicons name="call" size={20} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSafeMessage}
                    style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
                    accessibilityLabel="Send message"
                  >
                    <MaterialIcons name="message" size={20} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleWhatsApp}
                    style={[styles.actionButton, { backgroundColor: '#25D366' }]}
                    accessibilityLabel="Open WhatsApp"
                  >
                    <FontAwesome name="whatsapp" size={20} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSafeNotify}
                    style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
                    accessibilityLabel="Send notification"
                  >
                    <Ionicons name="notifications" size={20} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSafeMeeting}
                    style={[styles.actionButton, { backgroundColor: '#8b5cf6' }]}
                    accessibilityLabel="Schedule meeting"
                  >
                    <Entypo name="calendar" size={20} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleIncomingCall(lead?.mobile)}
                    style={[styles.actionButton, { backgroundColor: '#10b981' }]}
                    accessibilityLabel="Simulate incoming call"
                  >
                    <Ionicons name="call" size={20} color="#ffffff" />
                    <Text style={styles.buttonText}>Simulate Incoming</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// PropTypes for type safety
LeadModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  lead: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
    email: PropTypes.string,
    mobile: PropTypes.string,
    timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    imageUrl: PropTypes.string,
    icon: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    preferred_location: PropTypes.string,
    budget: PropTypes.string,
    max_budget: PropTypes.string,
    Payment_Method: PropTypes.string,
    requirement: PropTypes.string,
    leads_type: PropTypes.string,
    description: PropTypes.string,
    rDate: PropTypes.string,
    userType: PropTypes.string,
    Project_Builder: PropTypes.string,
    propertyType: PropTypes.string,
    propertyType_sub: PropTypes.string,
    source: PropTypes.string,
    Profession: PropTypes.string,
    deal: PropTypes.string,
    timeline: PropTypes.string,
    priority: PropTypes.string,
    userid: PropTypes.string,
    additional_info: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onCall: PropTypes.func,
  onIncomingCall: PropTypes.func,
  onMessage: PropTypes.func,
  onNotify: PropTypes.func,
  onMeeting: PropTypes.func,
  onStatusUpdate: PropTypes.func,
  onUpdateLead: PropTypes.func,
  onDeleteLead: PropTypes.func,
  allowedStatuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  userRole: PropTypes.string,
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    width: '95%',
    maxHeight: '95%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  scrollContent: {
    paddingBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  leadName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  leadSub: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statusIcon: {
    fontSize: 12,
    marginLeft: 6,
  },
  sectionContainer: {
    marginTop: 16,
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    height: 15,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    minWidth: 100,
    marginRight: 8,
  },
  fieldValue: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  fieldInput: {
    fontSize: 12,
    color: '#1f2937',
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginTop: 4,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 120 : 50,
    width: '100%',
    color: '#1f2937',
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  callIcon: {
    marginRight: 8,
  },
  callTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  callTimestamp: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    marginTop: 4,
  },
  playText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
    marginLeft: 6,
  },
  voiceNoteList: {
    width: '100%',
    marginTop: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 50,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    textAlign: 'center',
    marginVertical: 8,
  },
});