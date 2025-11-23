import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
import { Booking } from '../../types/database.types';
import { BookingStatusBadge } from './BookingStatusBadge';
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters';
import { colors, spacing, typography } from '../../lib/theme';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress }) => {
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
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.clientInfo}>
              <Avatar.Text
                size={40}
                label={booking.client?.full_name?.charAt(0) || 'C'}
                style={styles.avatar}
              />
              <View style={styles.clientDetails}>
                <Text style={styles.clientName}>{booking.client?.full_name || 'Client'}</Text>
                <Text style={styles.serviceType}>{getServiceTypeLabel(booking.service_type)}</Text>
              </View>
            </View>
            <BookingStatusBadge status={booking.status} />
          </View>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.icon}>📅</Text>
              <Text style={styles.detailText}>{formatDate(booking.booking_date)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.icon}>🕐</Text>
              <Text style={styles.detailText}>
                {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.icon}>📍</Text>
              <Text style={styles.detailText} numberOfLines={1}>
                {booking.location}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.amount}>{formatCurrency(booking.total_amount)}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  clientDetails: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  clientName: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text,
  },
  serviceType: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  details: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  detailText: {
    ...typography.body,
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  amount: {
    ...typography.h3,
    color: colors.primary,
    textAlign: 'right',
  },
});

