import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Avatar, Switch, Button } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useBookings, useBookingStats } from '../../hooks/useBookings';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { BookingCard } from '../../components/booking/BookingCard';
import { formatCurrency } from '../../utils/formatters';
import { colors, spacing, typography } from '../../lib/theme';
import { supabase } from '../../lib/supabase';

export const DashboardScreen = ({ navigation }: any) => {
  const { profile, workerProfile, refreshProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = 
    useBookingStats(profile?.id || '');

  const { data: recentBookings, isLoading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = 
    useBookings(profile?.id || '');

  const isLoading = statsLoading || bookingsLoading;
  const error = statsError || bookingsError;

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refreshProfile(),
      refetchStats(),
      refetchBookings(),
    ]);
    setRefreshing(false);
  };

  const handleAvailabilityToggle = async (value: boolean) => {
    if (!profile?.id) return;

    const newStatus = value ? 'available' : 'unavailable';
    const { error } = await supabase
      .from('worker_profiles')
      .update({ availability_status: newStatus })
      .eq('id', profile.id);

    if (!error) {
      await refreshProfile();
    }
  };

  if (isLoading && !refreshing) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error && !refreshing) {
    return <ErrorMessage message={error.message} onRetry={handleRefresh} />;
  }

  const recentBookingsList = recentBookings?.slice(0, 5) || [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          {profile?.avatar_url ? (
            <Avatar.Image
              size={60}
              source={{ uri: profile.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text
              size={60}
              label={profile?.full_name?.charAt(0) || 'W'}
              style={styles.avatar}
            />
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{profile?.full_name}</Text>
          </View>
        </View>

        <Card style={styles.availabilityCard}>
          <Card.Content style={styles.availabilityContent}>
            <View>
              <Text style={styles.availabilityLabel}>Availability</Text>
              <Text style={styles.availabilityStatus}>
                {workerProfile?.availability_status === 'available' ? 'Available' : 'Unavailable'}
              </Text>
            </View>
            <Switch
              value={workerProfile?.availability_status === 'available'}
              onValueChange={handleAvailabilityToggle}
              color={colors.success}
            />
          </Card.Content>
        </Card>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statValue}>{stats?.pending || 0}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statValue}>{stats?.upcoming || 0}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statValue}>{formatCurrency(stats?.totalEarningsThisMonth || 0)}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statValue}>
              {workerProfile?.rating?.toFixed(1) || 'N/A'}
            </Text>
            <Text style={styles.statLabel}>Rating</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Recent Bookings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Bookings')}
            compact
          >
            View All
          </Button>
        </View>

        {recentBookingsList.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No bookings yet</Text>
            </Card.Content>
          </Card>
        ) : (
          recentBookingsList.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onPress={() => navigation.navigate('BookingDetails', { bookingId: booking.id })}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  profileInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  greeting: {
    ...typography.body,
    color: colors.textSecondary,
  },
  name: {
    ...typography.h2,
    color: colors.text,
  },
  availabilityCard: {
    backgroundColor: colors.surface,
  },
  availabilityContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  availabilityStatus: {
    ...typography.h3,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
  },
  statCard: {
    width: '48%',
    margin: '1%',
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  emptyCard: {
    marginHorizontal: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

