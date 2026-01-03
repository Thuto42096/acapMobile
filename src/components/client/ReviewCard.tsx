import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Review } from '../../types/database.types';
import { colors, spacing, typography } from '../../lib/theme';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialCommunityIcons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color={colors.warning}
          />
        ))}
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          {review.client?.avatar_url ? (
            <Avatar.Image size={40} source={{ uri: review.client.avatar_url }} />
          ) : (
            <Avatar.Text
              size={40}
              label={review.client?.full_name?.charAt(0).toUpperCase() || 'C'}
              style={styles.avatar}
            />
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.clientName}>{review.client?.full_name || 'Client'}</Text>
            <Text style={styles.date}>{formatDate(review.created_at)}</Text>
          </View>
        </View>

        {renderStars(review.rating)}

        {review.comment && <Text style={styles.comment}>{review.comment}</Text>}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  clientName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  comment: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
  },
});

