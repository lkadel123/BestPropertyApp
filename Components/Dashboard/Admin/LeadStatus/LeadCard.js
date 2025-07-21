import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { useCallRecordingService } from '../../../../Services/CallRecordingService';

const LeadCard = ({ item, handleLeadPress, handleCall, handleMeeting, variant = 'default' }) => {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  const { handleOutgoingCall, isCallInProgress, isRecordingLoading } = useCallRecordingService(item?.phone);

  const handleCallAction = async () => {
    if (isCallInProgress) {
      Alert.alert('Error', 'Another call is in progress. Please wait until it completes.');
      return;
    }
    try {
      await handleOutgoingCall();
    } catch (error) {
      console.error('Failed to initiate call:', error);
      Alert.alert('Error', 'Failed to initiate call');
    }
  };

  const handleAddNote = () => {
    navigation.navigate('NoteModal', {
      leadId: item.id,
      leadName: item.name,
    })
  };


  const handleSetReminder = () => {
    navigation.navigate('ReminderModal', {
      leadId: item.id,
      leadName: item.name,
    });
  };

  const handleAskRating = () => {
    Alert.alert('Request Sent', `Rating request sent to ${item.name}`);
    // Future: Trigger backend/API for rating
  };

  return (
    <TouchableOpacity
      style={styles.leadCard}
      onPress={() => handleLeadPress(item)}
      activeOpacity={0.85}
    >
      {/* Top Status with Icon */}
      <View style={styles.topRow}>
        {item.icon ? (
          <Text style={styles.statusIcon}>{item.icon}</Text>
        ) : (
          <Ionicons name="help-circle" size={16} color="#6b7280" style={styles.statusIcon} />
        )}
        <Text style={styles.statusLabel}>{item.status || 'Unknown'}</Text>
      </View>

      <View style={styles.leadCardContent}>
        {/* Avatar with Favorite */}
        <View style={styles.avatarWrapper}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
          ) : (
            <MaterialIcons name="person" size={48} color="#6b7280" />
          )}
          <TouchableOpacity
            style={styles.favoriteIcon}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <MaterialIcons
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={20}
              color={isFavorite ? '#f43f5e' : '#9ca3af'}
            />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.leadTextContainer}>
          <Text style={styles.leadName}>{item.name || 'Unknown'}</Text>
          <Text style={styles.leadSub}>
            Last Updated:{' '}
            {item.timestamp
              ? new Date(item.timestamp).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
              : 'N/A'}
          </Text>
        </View>

        {/* Call + Meeting */}
        <View style={styles.actions}>
          {variant === 'meetingModal' ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.whatsappButton]}
              onPress={() => {
                const phone = item?.phone?.replace(/\s+/g, '') || '';
                if (!phone) {
                  Alert.alert('Missing Phone', 'No phone number available.');
                  return;
                }

                const message = `Hi ${item.name}, this is regarding our meeting.`;
                const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;

                Linking.canOpenURL(url)
                  .then(supported => {
                    if (supported) {
                      Linking.openURL(url);
                    } else {
                      Alert.alert('Error', 'WhatsApp is not installed or not supported.');
                    }
                  })
                  .catch(() => {
                    Alert.alert('Error', 'Unable to open WhatsApp.');
                  });
              }}
            >
              <FontAwesome name="whatsapp" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.meetingButton]}
              onPress={() => {
                navigation.navigate('Agenda', {
                  screen: 'MeetingModal',
                  params: { lead: item },
                });
              }}
            >
              <Entypo name="calendar" size={20} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, isCallInProgress && styles.disabledButton]}
            onPress={handleCall || handleCallAction}
            disabled={isRecordingLoading || isCallInProgress}
          >
            <Ionicons name="call" size={20} color="#fff" />
            {isCallInProgress && <Text style={styles.buttonText}>Calling...</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.bottomButton} onPress={handleAddNote}>
          <MaterialIcons name="note-add" size={18} color="#2563eb" />
          <Text style={styles.bottomText}>Add Note</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={handleSetReminder}>
          <Ionicons name="alarm" size={18} color="#f59e0b" />
          <Text style={styles.bottomText}>Reminder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={handleAskRating}>
          <FontAwesome name="star" size={18} color="#10b981" />
          <Text style={styles.bottomText}>Ask Rating</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

LeadCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    status: PropTypes.string,
    timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    imageUrl: PropTypes.string,
    icon: PropTypes.string,
  }).isRequired,
  handleLeadPress: PropTypes.func.isRequired,
  handleCall: PropTypes.func,
  handleMeeting: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  leadCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  topRow: {
    position: 'absolute',
    top: 5,
    left: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  statusIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  statusLabel: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
  },
  leadCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
  },
  avatarWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  favoriteIcon: {
    position: 'absolute',
    top: -6,
    left: -6,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 1,
    elevation: 2,
  },
  leadTextContainer: {
    flex: 1,
  },
  leadName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  leadSub: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 8,
    marginLeft: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetingButton: {
    backgroundColor: '#10b981',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  bottomButton: {
    alignItems: 'center',
    gap: 4,
  },
  bottomText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 2,
  },
});

export default LeadCard;