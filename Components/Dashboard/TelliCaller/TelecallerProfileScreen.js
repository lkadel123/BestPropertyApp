import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ProfileHeader from '../../Profile/ProfileHeader';
import AuthOptions from '../../Profile/AuthOptions';
import SupportCenter from '../../Profile/SupportCenter';
import CallMetricsCard from './CallMetricsCard';
import CallScriptAccess from './CallScriptAccess';

const TelecallerProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Image, Role, Status */}
      <ProfileHeader />

      {/* Daily Metrics (e.g., Calls done, Lead progress) */}
      <Section>
        <CallMetricsCard />
      </Section>

      {/* Access to Call Scripts */}
      <Section>
        <CallScriptAccess />
      </Section>

      {/* Authentication & Logout Options */}
      <Section>
        <AuthOptions />
      </Section>

      {/* Support & Feedback */}
      <Section>
        <SupportCenter />
      </Section>
    </ScrollView>
  );
};

const Section = ({ children }) => (
  <View style={styles.section}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    top: 1,
  },
  section: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
});

export default TelecallerProfileScreen;
