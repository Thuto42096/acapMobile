import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import { useClientBookings, useClientBookingStats } from '../../hooks/useClientBookings';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ClientBookingCard } from '../../components/client/ClientBookingCard';
import { colors, spacing, typography } from '../../lib/theme';

export const ClientDashboardScreen = ({ navigation }: any) => {
  const { profile } = useAuth();
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useClientBookingStats(profile?.id || '');
  const { data: bookings, isLoading: bookingsLoading, refetch: refetchBookings } = useClientBookings(profile?.id || '');
  const [refreshing, setRefreshing] = React.useState(false);

  const recentBookings = bookings?.slice(0, 5) || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchBookings()]);
    setRefreshing(false);
  };

  if (statsLoading || bookingsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        {profile?.avatar_url ? (
          <Avatar.Image size={60} source={{ uri: profile.avatar_url }} />
        ) : (
          <Avatar.Text
            size={60}
            label={profile?.full_name?.charAt(0).toUpperCase() || 'C'}
            style={styles.avatar}
          />
        )}
        <View style={styles.welcomeText}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{profile?.full_name || 'Client'}</Text>
        </View>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons name="clock-outline" size={32} color={colors.primary} />
            <Text style={styles.statValue}>{stats?.active || 0}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons name="check-circle" size={32} color={colors.success} />
            <Text style={styles.statValue}>{stats?.completed || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons name="cash" size={32} color={colors.warning} />
            <Text style={styles.statValue}>R{stats?.totalSpent || 0}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Find Workers Button */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate('BrowseWorkers')}
        style={styles.findWorkersButton}
        icon="magnify"
      >
        Find Workers
      </Button>

      {/* Recent Bookings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Bookings</Text>
        {recentBookings.length === 0 ? (
          <EmptyState
            icon="calendar-blank"
            message="No bookings yet"
            description="Find and book workers to get started"
          />
        ) : (
          recentBookings.map((booking) => (
            <ClientBookingCard
              key={booking.id}
              booking={booking}
              onPress={() => navigation.navigate('MyBookings', {
                screen: 'MyBookingDetails',
                params: { bookingId: booking.id },
              })}
            />
          ))
        )}
      </View>

      {recentBookings.length > 0 && (
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('MyBookings')}
          style={styles.viewAllButton}
        >
          View All Bookings
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  welcomeText: {
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
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  findWorkersButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  viewAllButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
});

