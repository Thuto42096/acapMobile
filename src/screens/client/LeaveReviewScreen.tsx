import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import { useWorker } from '../../hooks/useWorkers';
import { useBookingReview, useSubmitReview } from '../../hooks/useReviews';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { colors, spacing, typography } from '../../lib/theme';

export const LeaveReviewScreen = ({ route, navigation }: any) => {
  const { bookingId, workerId } = route.params;
  const { profile } = useAuth();
  const { data: worker, isLoading: workerLoading } = useWorker(workerId);
  const { data: existingReview, isLoading: reviewLoading } = useBookingReview(bookingId);
  const submitReview = useSubmitReview();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (workerLoading || reviewLoading) {
    return <LoadingSpinner />;
  }

  if (existingReview) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Review Already Submitted</Text>
            <Text style={styles.message}>
              You have already reviewed this booking. Thank you for your feedback!
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.goBack()}
              style={styles.button}
            >
              Go Back
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const handleSubmit = async () => {
    // Validation
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    if (comment.trim().length < 10) {
      Alert.alert('Error', 'Please write at least 10 characters in your review');
      return;
    }

    setLoading(true);
    try {
      await submitReview.mutateAsync({
        booking_id: bookingId,
        worker_id: workerId,
        client_id: profile!.id,
        rating,
        comment: comment.trim(),
      });

      Alert.alert('Success', 'Thank you for your review!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('ClientDashboard'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Worker Info */}
      <Card style={styles.workerCard}>
        <Card.Content>
          <Text style={styles.workerName}>{worker?.profile.full_name}</Text>
          <Text style={styles.workerInfo}>
            {worker?.service_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.form}>
        {/* Rating */}
        <Text style={styles.label}>Rating *</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <MaterialCommunityIcons
                name={star <= rating ? 'star' : 'star-outline'}
                size={48}
                color={star <= rating ? colors.warning : colors.textSecondary}
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingText}>
          {rating === 0
            ? 'Tap to rate'
            : rating === 1
            ? 'Poor'
            : rating === 2
            ? 'Fair'
            : rating === 3
            ? 'Good'
            : rating === 4
            ? 'Very Good'
            : 'Excellent'}
        </Text>

        {/* Comment */}
        <TextInput
          label="Your Review *"
          value={comment}
          onChangeText={setComment}
          mode="outlined"
          multiline
          numberOfLines={6}
          placeholder="Share your experience with this worker..."
          style={styles.input}
        />
        <Text style={styles.characterCount}>
          {comment.length} / 10 characters minimum
        </Text>

        {/* Guidelines */}
        <Card style={styles.guidelinesCard}>
          <Card.Content>
            <Text style={styles.guidelinesTitle}>📝 Review Guidelines:</Text>
            <Text style={styles.guidelineText}>• Be honest and fair</Text>
            <Text style={styles.guidelineText}>• Focus on service quality</Text>
            <Text style={styles.guidelineText}>• Avoid offensive language</Text>
            <Text style={styles.guidelineText}>• Be specific and helpful</Text>
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading || rating === 0 || comment.trim().length < 10}
          style={styles.submitButton}
        >
          Submit Review
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    margin: spacing.lg,
    elevation: 2,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
  },
  workerCard: {
    margin: spacing.md,
    elevation: 2,
  },
  workerName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  workerInfo: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    padding: spacing.md,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  star: {
    marginHorizontal: spacing.xs,
  },
  ratingText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.sm,
  },
  characterCount: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: spacing.md,
  },
  guidelinesCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary + '10',
  },
  guidelinesTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  guidelineText: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  submitButton: {
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
    marginBottom: spacing.xl,
  },
});

