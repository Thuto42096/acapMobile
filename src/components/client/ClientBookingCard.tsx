import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Booking } from '../../types/database.types';
import { colors, spacing, typography } from '../../lib/theme';
import { BookingStatusBadge } from '../booking/BookingStatusBadge';

interface ClientBookingCardProps {
  booking: Booking;
  onPress: () => void;
  onCancel?: () => void;
  onReview?: () => void;
}

export const ClientBookingCard: React.FC<ClientBookingCardProps> = ({
  booking,
  onPress,
  onCancel,
  onReview,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // HH:MM
  };

  const canCancel = booking.status === 'pending';
  const canReview = booking.status === 'completed';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            {booking.worker?.avatar_url ? (
              <Avatar.Image size={50} source={{ uri: booking.worker.avatar_url }} />
            ) : (
              <Avatar.Text
                size={50}
                label={booking.worker?.full_name?.charAt(0).toUpperCase() || 'W'}
                style={styles.avatar}
              />
            )}
            <View style={styles.headerInfo}>
              <Text style={styles.workerName}>{booking.worker?.full_name || 'Worker'}</Text>
              <Text style={styles.serviceType}>
                {booking.service_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="calendar" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>
                {formatDate(booking.booking_date)}, {formatTime(booking.start_time)}
              </Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="map-marker" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText} numberOfLines={1}>
                {booking.location}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <BookingStatusBadge status={booking.status} />
            <Text style={styles.amount}>R{booking.total_amount.toFixed(2)}</Text>
          </View>

          {canCancel && onCancel && (
            <Button
              mode="outlined"
              onPress={onCancel}
              style={styles.cancelButton}
              textColor={colors.error}
            >
              Cancel Booking
            </Button>
          )}

          {canReview && onReview && (
            <Button
              mode="contained"
              onPress={onReview}
              style={styles.reviewButton}
              icon="star"
            >
              Leave Review
            </Button>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  workerName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  serviceType: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  detailsRow: {
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  amount: {
    ...typography.h3,
    color: colors.primary,
  },
  cancelButton: {
    marginTop: spacing.md,
    borderColor: colors.error,
  },
  reviewButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
  },
});

