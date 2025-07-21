import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import { Alert, Linking } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

export const useCallRecordingService = (leadPhone, onCall, onIncomingCall) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [callStartTime, setCallStartTime] = useState(null);
  const [isRecordingLoading, setIsRecordingLoading] = useState(false);
  const soundRef = useRef(null);

// Permissions on mount
useEffect(() => {
  const requestPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version <= 29) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to save call recordings.',
          buttonPositive: 'Allow',
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Cannot save recordings without storage access.');
        setHasPermission(false);
        return;
      }
    }

    // Request MediaLibrary permission as well
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  requestPermissions();
}, []);


  // Fetch saved recordings
  useEffect(() => {
    if (!hasPermission || !leadPhone) return;

    const fetchRecordings = async () => {
      try {
        const album = await MediaLibrary.getAlbumAsync('CallRecordings');
        if (!album) return;

        const { assets } = await MediaLibrary.getAssetsAsync({
          album,
          mediaType: ['audio'],
          sortBy: ['creationTime'],
        });

        const phone = leadPhone.replace(/\D/g, '');
        const filtered = assets.filter((a) => a.filename.includes(`Call_${phone}`));
        setRecordings(filtered);

        setCallHistory((prev) =>
          prev
            .map((call) => {
              const match = filtered.find((a) => a.uri === call.recording?.uri);
              return {
                ...call,
                recording: match ? { uri: match.uri } : null,
              };
            })
            .filter((c) => !c.recording || filtered.some((a) => a.uri === c.recording.uri))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 2)
        );
      } catch (err) {
        console.error('Failed to fetch recordings:', err);
        setRecordings([]);
        setCallHistory([]);
      }
    };

    fetchRecordings();
  }, [hasPermission, leadPhone]);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(console.error);
      }
    };
  }, []);

  const startRecording = async () => {
  if (!hasPermission) return;

  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    setRecording(recording);
    return recording;
  } catch (err) {
    console.error('Recording start failed:', err);
    return null;
  }
};

const stopRecording = async () => {
  if (!recording) return null;

  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); // Now safe
    setRecording(null);
    return uri;
  } catch (err) {
    console.error('Recording stop failed:', err);
    return null;
  }
};


  const saveRecording = async (uri, callId, phone) => {
    if (!hasPermission) return null;

    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        console.error('Recording file not found:', uri);
        return null;
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('CallRecordings', asset, false);
      Alert.alert('Recording saved to CallRecordings album.');
      return asset.uri;
    } catch (err) {
      console.error('Save recording error:', err);
      Alert.alert('Save Failed', err.message || 'Could not save recording.');
      return null;
    }
  };

  const playRecording = async ({ uri }) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) throw new Error('File not found');

      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync().catch(console.error);
          soundRef.current = null;
        }
      });
    } catch (err) {
      console.error('Playback error:', err);
      Alert.alert('Playback Failed', err.message);
    }
  };

  const handleCall = async (type, phone) => {
    const callId = Date.now().toString();
    const timestamp = Date.now();
    setCallStartTime(timestamp);

    const rec = await startRecording();
    try {
      const result = type === 'outgoing' ? await onCall?.(phone) : await onIncomingCall?.(phone);
      const duration = callStartTime ? Math.round((Date.now() - callStartTime) / 1000) : 0;
      let uri = null;
      if (rec) {
        uri = await saveRecording(rec.getURI(), callId, phone);
      }

      setCallHistory((prev) => [
        {
          id: callId,
          type,
          duration: `${Math.floor(duration / 60)} min ${duration % 60} sec`,
          timestamp,
          recording: uri ? { uri } : null,
        },
        ...prev,
      ].slice(0, 2));
    } catch (err) {
      console.error('Call error:', err);
    } finally {
      await stopRecording();
      setCallStartTime(null);
    }
  };

  return {
    hasPermission,
    recording,
    recordings,
    callHistory,
    isRecordingLoading,
    startRecording,
    stopRecording,
    saveRecording,
    playRecording,
    handleOutgoingCall: () => handleCall('outgoing', leadPhone),
    handleIncomingCall: (phone) => handleCall('incoming', phone),
  };
};
