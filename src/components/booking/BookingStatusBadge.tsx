import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { BookingStatus } from '../../types/database.types';
import { colors } from '../../lib/theme';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', color: colors.warning };
      case 'accepted':
        return { label: 'Accepted', color: colors.primary };
      case 'in_progress':
        return { label: 'In Progress', color: colors.success };
      case 'completed':
        return { label: 'Completed', color: colors.success };
      case 'cancelled':
        return { label: 'Cancelled', color: colors.error };
      default:
        return { label: status, color: colors.textSecondary };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      mode="flat"
      style={[styles.chip, { backgroundColor: `${config.color}20` }]}
      textStyle={[styles.text, { color: config.color }]}
    >
      {config.label}
    </Chip>
  );
};

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    fontSize: 12,
  },
});

