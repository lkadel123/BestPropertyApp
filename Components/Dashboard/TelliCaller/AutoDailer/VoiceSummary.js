// VoiceSummary.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function VoiceSummary({
  hasPermission,
  recording,
  isRecordingLoading,
  recordings,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎤 Voice Summary</Text>

      {!hasPermission && (
        <Text style={styles.errorText}>
          Call recording is disabled. Please grant microphone and media permissions in settings.
        </Text>
      )}

      {recording ? (
        <TouchableOpacity
          onPress={onStopRecording}
          style={[styles.voiceBtn, !hasPermission && styles.disabledButton]}
          disabled={!hasPermission}
        >
          <Feather name="square" size={18} color="#fff" />
          <Text style={styles.voiceBtnText}>Stop Recording</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onStartRecording}
          style={[styles.voiceBtn, (isRecordingLoading || !hasPermission) && styles.disabledButton]}
          disabled={isRecordingLoading || !hasPermission}
        >
          <Feather name="mic" size={18} color="#fff" />
          <Text style={styles.voiceBtnText}>Start Recording</Text>
        </TouchableOpacity>
      )}

      {recordings.length > 0 && (
        <FlatList
          data={recordings.slice(0, 3)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              onPress={() => onPlayRecording({ uri: item.uri })}
              style={styles.playBtn}
            >
              <Feather name="play-circle" size={18} color="#2980b9" />
              <Text style={styles.playBtnText}>
                Play {new Date(item.creationTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.recordingsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    elevation: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 6,
  },
  voiceBtn: {
    backgroundColor: '#e67e22',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  voiceBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  playBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playBtnText: {
    color: '#2980b9',
    fontWeight: '600',
  },
  recordingsList: {
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginBottom: 8,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
});
