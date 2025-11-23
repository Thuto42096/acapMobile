import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useBookings } from '../../hooks/useBookings';
import { BookingStatus } from '../../types/database.types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { BookingCard } from '../../components/booking/BookingCard';
import { colors, spacing } from '../../lib/theme';

export const BookingsListScreen = ({ navigation }: any) => {
  const { profile } = useAuth();
  const [selectedTab, setSelectedTab] = useState<BookingStatus | 'all'>('pending');
  const [refreshing, setRefreshing] = useState(false);

  const statusFilter = selectedTab === 'all' ? undefined : selectedTab;
  const { data: bookings, isLoading, error, refetch } = useBookings(
    profile?.id || '',
    statusFilter
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) {
    return <LoadingSpinner message="Loading bookings..." />;
  }

  if (error && !refreshing) {
    return <ErrorMessage message={error.message} onRetry={handleRefresh} />;
  }

  const filteredBookings = bookings || [];

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as BookingStatus | 'all')}
        buttons={[
          { value: 'pending', label: 'Pending' },
          { value: 'accepted', label: 'Upcoming' },
          { value: 'in_progress', label: 'Active' },
          { value: 'completed', label: 'Completed' },
        ]}
        style={styles.tabs}
      />

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() => navigation.navigate('BookingDetails', { bookingId: item.id })}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📋"
            title="No Bookings"
            message={`You don't have any ${selectedTab === 'all' ? '' : selectedTab} bookings yet.`}
          />
        }
        contentContainerStyle={
          filteredBookings.length === 0 ? styles.emptyContainer : styles.listContent
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  tabs: {
    margin: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
  },
});

