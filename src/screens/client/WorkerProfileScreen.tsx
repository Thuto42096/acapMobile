import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWorker, useWorkerReviews } from '../../hooks/useWorkers';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ReviewCard } from '../../components/client/ReviewCard';
import { colors, spacing, typography } from '../../lib/theme';

const SERVICE_TYPE_LABELS: Record<string, string> = {
  domestic_worker: 'Domestic Worker',
  gardener: 'Gardener',
  plumber: 'Plumber',
  handyman: 'Handyman',
};

export const WorkerProfileScreen = ({ route, navigation }: any) => {
  const { workerId } = route.params;
  const { data: worker, isLoading } = useWorker(workerId);
  const { data: reviews } = useWorkerReviews(workerId);

  if (isLoading || !worker) {
    return <LoadingSpinner />;
  }

  const serviceLabel = SERVICE_TYPE_LABELS[worker.service_type] || worker.service_type;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.header}>
          {worker.profile.avatar_url ? (
            <Avatar.Image size={100} source={{ uri: worker.profile.avatar_url }} />
          ) : (
            <Avatar.Text
              size={100}
              label={worker.profile.full_name.charAt(0).toUpperCase()}
              style={styles.avatar}
            />
          )}
          <Text style={styles.name}>{worker.profile.full_name}</Text>
          <View style={styles.serviceRow}>
            <Chip style={styles.serviceChip} textStyle={styles.serviceChipText}>
              {serviceLabel}
            </Chip>
            {worker.verification_status === 'verified' && (
              <MaterialCommunityIcons
                name="check-decagram"
                size={24}
                color={colors.success}
                style={styles.verifiedIcon}
              />
            )}
          </View>
        </View>

        {/* Stats Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="star" size={24} color={colors.warning} />
                <Text style={styles.statValue}>
                  {worker.rating ? worker.rating.toFixed(1) : 'N/A'}
                </Text>
                <Text style={styles.statLabel}>
                  {worker.total_reviews} {worker.total_reviews === 1 ? 'review' : 'reviews'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="briefcase" size={24} color={colors.primary} />
                <Text style={styles.statValue}>{worker.experience_years}+</Text>
                <Text style={styles.statLabel}>years</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="cash" size={24} color={colors.success} />
                <Text style={styles.statValue}>R{worker.hourly_rate}</Text>
                <Text style={styles.statLabel}>per hour</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* About Section */}
        {worker.bio && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{worker.bio}</Text>
            </Card.Content>
          </Card>
        )}

        {/* Skills Section */}
        {worker.skills && worker.skills.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsContainer}>
                {worker.skills.map((skill, index) => (
                  <Chip key={index} style={styles.skillChip} textStyle={styles.skillText}>
                    {skill}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
              {reviews.slice(0, 5).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
              {reviews.length > 5 && (
                <Text style={styles.moreReviews}>+{reviews.length - 5} more reviews</Text>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate('BrowseWorkers', {
              screen: 'CreateBooking',
              params: { workerId: worker.id },
            })
          }
          style={styles.bookButton}
          icon="calendar-plus"
        >
          Book Now
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  name: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.md,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  serviceChip: {
    backgroundColor: colors.primary,
  },
  serviceChipText: {
    color: colors.white,
  },
  verifiedIcon: {
    marginLeft: spacing.sm,
  },
  card: {
    margin: spacing.md,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  bio: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  skillText: {
    fontSize: 14,
  },
  moreReviews: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bookButton: {
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
  },
});

