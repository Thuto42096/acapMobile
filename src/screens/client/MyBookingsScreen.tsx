import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useClientBookings, useCancelBooking } from '../../hooks/useClientBookings';
import { useBookingReview } from '../../hooks/useReviews';
import { ClientBookingCard } from '../../components/client/ClientBookingCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { BookingStatus } from '../../types/database.types';
import { colors, spacing, typography } from '../../lib/theme';

type FilterType = 'active' | 'completed' | 'cancelled' | 'all';

export const MyBookingsScreen = ({ navigation }: any) => {
  const { profile } = useAuth();
  const [filter, setFilter] = useState<FilterType>('active');
  const { data: bookings, isLoading, refetch } = useClientBookings(profile?.id || '');
  const cancelBooking = useCancelBooking();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking.mutateAsync(bookingId);
              Alert.alert('Success', 'Booking cancelled successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel booking');
            }
          },
        },
      ]
    );
  };

  const handleReview = (bookingId: string, workerId: string) => {
    navigation.navigate('BrowseWorkers', {
      screen: 'LeaveReview',
      params: { bookingId, workerId },
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Filter bookings based on selected filter
  const filteredBookings = bookings?.filter((booking) => {
    if (filter === 'all') return true;
    if (filter === 'active') {
      return ['pending', 'accepted', 'in_progress'].includes(booking.status);
    }
    return booking.status === filter;
  }) || [];

  const getEmptyMessage = () => {
    switch (filter) {
      case 'active':
        return 'No active bookings';
      case 'completed':
        return 'No completed bookings';
      case 'cancelled':
        return 'No cancelled bookings';
      default:
        return 'No bookings yet';
    }
  };

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={(value) => setFilter(value as FilterType)}
          buttons={[
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
            { value: 'all', label: 'All' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Bookings List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon="calendar-blank"
            message={getEmptyMessage()}
            description="Find and book workers to get started"
          />
        ) : (
          filteredBookings.map((booking) => (
            <ClientBookingCard
              key={booking.id}
              booking={booking}
              onPress={() =>
                navigation.navigate('MyBookingDetails', { bookingId: booking.id })
              }
              onCancel={
                booking.status === 'pending'
                  ? () => handleCancelBooking(booking.id)
                  : undefined
              }
              onReview={
                booking.status === 'completed'
                  ? () => handleReview(booking.id, booking.worker_id)
                  : undefined
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  segmentedButtons: {
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
});

