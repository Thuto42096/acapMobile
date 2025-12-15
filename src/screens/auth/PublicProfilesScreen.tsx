import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, SegmentedButtons, Searchbar, Button } from 'react-native-paper';
import { usePublicProfiles } from '../../hooks/usePublicProfiles';
import { WorkerProfileCard } from '../../components/profile/WorkerProfileCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ServiceType } from '../../types/database.types';
import { colors, spacing, typography } from '../../lib/theme';

export const PublicProfilesScreen = ({ navigation }: any) => {
  const [serviceType, setServiceType] = useState<ServiceType | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: profiles, isLoading, error, refetch } = usePublicProfiles(serviceType);

  const filteredProfiles = profiles?.filter((profile) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      profile.profile.full_name?.toLowerCase().includes(query) ||
      profile.workerProfile.bio?.toLowerCase().includes(query) ||
      profile.workerProfile.skills?.some((skill) => skill.toLowerCase().includes(query))
    );
  });

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading worker profiles..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load worker profiles"
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Find Workers</Text>
        <Text style={styles.subtitle}>Browse verified professionals</Text>
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search by name, skills..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Service Type Filter */}
      <SegmentedButtons
        value={serviceType || 'all'}
        onValueChange={(value) => setServiceType(value === 'all' ? undefined : value as ServiceType)}
        buttons={[
          { value: 'all', label: 'All' },
          { value: 'domestic_worker', label: 'Domestic' },
          { value: 'gardener', label: 'Gardener' },
          { value: 'plumber', label: 'Plumber' },
          { value: 'handyman', label: 'Handyman' },
        ]}
        style={styles.segmentedButtons}
      />

      {/* Profiles List */}
      <FlatList
        data={filteredProfiles}
        keyExtractor={(item) => item.profile.id}
        renderItem={({ item }) => <WorkerProfileCard profile={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="account-search"
            message={
              searchQuery
                ? 'No workers found matching your search'
                : serviceType
                ? `No ${serviceType.replace('_', ' ')}s available`
                : 'No workers available at the moment'
            }
          />
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} colors={[colors.primary]} />
        }
      />

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <Text style={styles.actionText}>Ready to book a worker?</Text>
        <View style={styles.buttonRow}>
          <Button
            mode="contained"
            onPress={handleSignIn}
            style={styles.signInButton}
            icon="login"
          >
            Sign In
          </Button>
          <Button
            mode="outlined"
            onPress={handleSignUp}
            style={styles.signUpButton}
          >
            Sign Up
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.primary,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
  },
  searchBar: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  segmentedButtons: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  bottomActions: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  signInButton: {
    flex: 1,
  },
  signUpButton: {
    flex: 1,
  },
});

