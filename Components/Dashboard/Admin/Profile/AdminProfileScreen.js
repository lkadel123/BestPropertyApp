import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ProfileHeader from '../../../Profile/ProfileHeader';
import AuthOptions from '../../../Profile/AuthOptions';
import SupportCenter from '../../../Profile/SupportCenter';
import AdminQuickLinks from './AdminQuickLinks';
import AdminStatsCard from './AdminStatsCard';

const AdminProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header: Name, Role, Image */}
      <ProfileHeader />

      {/* Quick Links: User Mgmt, Settings, Audit Logs, etc. */}
      <Section>
        <AdminQuickLinks />
      </Section>

      {/* Admin Stats Overview */}
      <Section>
        <AdminStatsCard />
      </Section>

      {/* Auth Controls */}
      <Section>
        <AuthOptions />
      </Section>

      {/* Support */}
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

export default AdminProfileScreen;