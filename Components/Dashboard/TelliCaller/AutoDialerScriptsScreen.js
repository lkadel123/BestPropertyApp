import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import LeadCard from './AutoDailer/LeadCard';
import ScriptSection from './AutoDailer/ScriptSection';
import OutcomePicker from './AutoDailer/OutcomePicker';
import FollowUpDateSelector from './AutoDailer/FollowUpDateSelector';
import StatusRating from './AutoDailer/StatusRating';
import NotesInput from './AutoDailer/NotesInput';
import VoiceSummary from './AutoDailer/VoiceSummary';
import ActionButtons from './AutoDailer/ActionButtons';
import LeadSearchModal from './AutoDailer/LeadSearchModal';
import { useCallRecordingService } from '../../../Services/CallRecordingService';

export default function AutoDialerScriptsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [leads, setLeads] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [note, setNote] = useState('');
  const [outcome, setOutcome] = useState('');
  const [followUpDate, setFollowUpDate] = useState(null);
  const [statusRating, setStatusRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const lead = leads[currentIndex] || {};

  const {
    hasPermission,
    recording,
    recordings,
    isRecordingLoading,
    isCallInProgress,
    handleOutgoingCall,
    stopRecording,
    playRecording,
  } = useCallRecordingService(lead?.phone);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const leadsData = require('../../../assets/Data/Leads.json');
        const validLeads = leadsData.filter(l => l && l.name && l.phone);
        setLeads(validLeads);
      } catch (e) {
        console.error(e);
        setError('Failed to load leads.');
      } finally {
        setLoading(false);
      }
    };
    loadLeads();
  }, []);

  useEffect(() => {
    const filtered = leads.filter((lead) => {
      const nameMatch =
        typeof lead.name === 'string' && searchQuery
          ? lead.name.toLowerCase().includes(searchQuery.toLowerCase())
          : false;

      const phoneMatch =
        typeof lead.phone === 'string' && searchQuery
          ? lead.phone.replace(/\D/g, '').includes(searchQuery.replace(/\D/g, ''))
          : false;

      return nameMatch || phoneMatch;
    });

    setFilteredLeads(filtered);
  }, [searchQuery, leads]);

  const resetForm = () => {
    setNote('');
    setOutcome('');
    setFollowUpDate(null);
    setStatusRating(0);
  };

  const handleSubmitAndNext = () => {
    if (!outcome) {
      Alert.alert('Incomplete', 'Please select a call outcome.');
      return;
    }

    console.log('Lead log:', {
      leadId: lead.id,
      note,
      outcome,
      followUpDate: followUpDate ? followUpDate.toISOString() : null,
      statusRating,
    });

    if (currentIndex < leads.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetForm();
    } else {
      Alert.alert('Queue Complete', 'All leads processed.');
    }
  };

  const handleSkip = () => {
    Alert.alert('Skip Lead?', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Skip',
        style: 'destructive',
        onPress: () => {
          if (currentIndex < leads.length - 1) {
            setCurrentIndex(currentIndex + 1);
            resetForm();
          }
        },
      },
    ]);
  };

  const handleSelectLead = (index) => {
    setCurrentIndex(index);
    resetForm();
    setIsSearchModalVisible(false);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#2980b9" />;
  }

  if (error) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>{error}</Text>;
  }

  if (leads.length === 0) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>No leads found.</Text>;
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <LeadSearchModal
        visible={isSearchModalVisible}
        onClose={() => setIsSearchModalVisible(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        leads={filteredLeads}
        onSelect={(selectedLead) => {
          const index = leads.findIndex((l) => l.id === selectedLead.id);
          handleSelectLead(index);
        }}
      />

      <LeadCard lead={lead} />

      <ScriptSection script={lead?.script || ''} />

      <OutcomePicker outcome={outcome} setOutcome={setOutcome} />
      <FollowUpDateSelector date={followUpDate} setDate={setFollowUpDate} />
      <StatusRating rating={statusRating} setRating={setStatusRating} />
      <NotesInput note={note} setNote={setNote} />

      <VoiceSummary
        recording={recording}
        recordings={recordings}
        hasPermission={hasPermission}
        stopRecording={stopRecording}
        startRecording={handleOutgoingCall}
        playRecording={playRecording}
        loading={isRecordingLoading}
      />

      <ActionButtons onSkip={handleSkip} onNext={handleSubmitAndNext} disabled={!outcome} />
    </ScrollView>
  );
}
