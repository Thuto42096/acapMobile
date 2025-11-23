import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Text, Card, Button, Avatar, Divider } from 'react-native-paper';
import { useBooking, useUpdateBookingStatus } from '../../hooks/useBookings';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { BookingStatusBadge } from '../../components/booking/BookingStatusBadge';
import { formatDate, formatTime, formatCurrency, formatPhoneNumber } from '../../utils/formatters';
import { colors, spacing, typography } from '../../lib/theme';

export const BookingDetailsScreen = ({ route, navigation }: any) => {
  const { bookingId } = route.params;
  const { data: booking, isLoading, error, refetch } = useBooking(bookingId);
  const updateStatus = useUpdateBookingStatus();
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${newStatus.replace('_', ' ')} this booking?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setUpdating(true);
            try {
              await updateStatus.mutateAsync({ bookingId, status: newStatus as any });
              await refetch();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to update booking status');
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const handleCall = () => {
    if (booking?.client?.phone) {
      Linking.openURL(`tel:${booking.client.phone}`);
    }
  };

  const handleOpenMap = () => {
    if (booking?.location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        booking.location
      )}`;
      Linking.openURL(url);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading booking details..." />;
  }

  if (error || !booking) {
    return <ErrorMessage message={error?.message || 'Booking not found'} onRetry={refetch} />;
  }

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      domestic_worker: 'Domestic Worker',
      gardener: 'Gardener',
      plumber: 'Plumber',
      handyman: 'Handyman',
    };
    return labels[type] || type;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Status */}
      <View style={styles.statusContainer}>
        <BookingStatusBadge status={booking.status} />
      </View>

      {/* Client Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.clientInfo}>
            <Avatar.Text
              size={60}
              label={booking.client?.full_name?.charAt(0) || 'C'}
              style={styles.avatar}
            />
            <View style={styles.clientDetails}>
              <Text style={styles.clientName}>{booking.client?.full_name}</Text>
              <Text style={styles.clientContact}>{formatPhoneNumber(booking.client?.phone || '')}</Text>
            </View>
          </View>
          <Button
            mode="outlined"
            icon="phone"
            onPress={handleCall}
            style={styles.actionButton}
          >
            Call Client
          </Button>
        </Card.Content>
      </Card>

      {/* Booking Details */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Booking Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service Type</Text>
            <Text style={styles.detailValue}>{getServiceTypeLabel(booking.service_type)}</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(booking.booking_date)}</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>
              {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{booking.location}</Text>
          </View>

          <Button
            mode="outlined"
            icon="map-marker"
            onPress={handleOpenMap}
            style={styles.actionButton}
          >
            Open in Maps
          </Button>

          {booking.description && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.description}>{booking.description}</Text>
            </>
          )}

          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.amount}>{formatCurrency(booking.total_amount)}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {booking.status === 'pending' && (
          <>
            <Button
              mode="contained"
              onPress={() => handleStatusUpdate('accepted')}
              loading={updating}
              disabled={updating}
              style={styles.primaryButton}
            >
              Accept Booking
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleStatusUpdate('cancelled')}
              loading={updating}
              disabled={updating}
              style={styles.secondaryButton}
              textColor={colors.error}
            >
              Decline
            </Button>
          </>
        )}

        {booking.status === 'accepted' && (
          <>
            <Button
              mode="contained"
              onPress={() => handleStatusUpdate('in_progress')}
              loading={updating}
              disabled={updating}
              style={styles.primaryButton}
            >
              Start Job
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleStatusUpdate('cancelled')}
              loading={updating}
              disabled={updating}
              style={styles.secondaryButton}
              textColor={colors.error}
            >
              Cancel Booking
            </Button>
          </>
        )}

        {booking.status === 'in_progress' && (
          <Button
            mode="contained"
            onPress={() => handleStatusUpdate('completed')}
            loading={updating}
            disabled={updating}
            style={styles.primaryButton}
          >
            Complete Job
          </Button>
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
  statusContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  card: {
    margin: spacing.md,
    marginTop: 0,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  clientDetails: {
    marginLeft: spacing.md,
    flex: 1,
  },
  clientName: {
    ...typography.h3,
    fontSize: 18,
    color: colors.text,
  },
  clientContact: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    marginVertical: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
  },
  amount: {
    ...typography.h3,
    color: colors.primary,
  },
  actionButton: {
    marginTop: spacing.sm,
  },
  actionsContainer: {
    padding: spacing.md,
  },
  primaryButton: {
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  secondaryButton: {
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
