// /screens/Profile/ManagerProfileScreen.js

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ProfileHeader from '../../Profile/ProfileHeader';
import KYCUploader from '../../Profile/KYCUploader';
import AuthOptions from '../../Profile/AuthOptions';
import SupportCenter from '../../Profile/SupportCenter';

// New manager-specific components
import AssignedProjectsCard from './AssignedProjectsCard';
import TeamOverviewCard from './TeamOverviewCard';
import ManagerPerformanceCard from './ManagerPerformanceCard';

const ManagerProfileScreen = () => {
    return (
        <ScrollView style={styles.container}>
            {/* Profile Info */}
            <ProfileHeader userRole="Manager" />

            {/* KYC Upload */}
            <Section>
                <KYCUploader />
            </Section>

            {/* Assigned Projects */}
            <Section>
                <AssignedProjectsCard />
            </Section>

            {/* Team Overview */}
            <Section>
                <TeamOverviewCard
                    teamStats={{
                        totalMembers: 12,
                        sales: 5,
                        telecallers: 4,
                        siteCoordinators: 3,
                        callsToday: 80,
                        tasksAssigned: 50,
                        tasksCompleted: 32,
                    }}
                />
            </Section>

            {/* Performance Metrics */}
            <Section>
                <ManagerPerformanceCard
                    data={{
                        totalTeamMembers: 8,
                        leadsHandled: 150,
                        dealsClosed: 42,
                        tasksAssigned: 95,
                        activeProjects: 6,
                    }}
                />
            </Section>

            {/* Auth & Logout */}
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
    <View style={styles.section}>{children}</View>
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

export default ManagerProfileScreen;
