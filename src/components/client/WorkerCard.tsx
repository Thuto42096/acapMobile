import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkerWithProfile } from '../../hooks/useWorkers';
import { colors, spacing, typography } from '../../lib/theme';

interface WorkerCardProps {
  worker: WorkerWithProfile;
  onPress: () => void;
}

const SERVICE_TYPE_ICONS: Record<string, string> = {
  domestic_worker: 'broom',
  gardener: 'flower',
  plumber: 'pipe-wrench',
  handyman: 'hammer-wrench',
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  domestic_worker: 'Domestic Worker',
  gardener: 'Gardener',
  plumber: 'Plumber',
  handyman: 'Handyman',
};

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onPress }) => {
  const serviceIcon = SERVICE_TYPE_ICONS[worker.service_type] || 'briefcase';
  const serviceLabel = SERVICE_TYPE_LABELS[worker.service_type] || worker.service_type;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            {worker.profile.avatar_url ? (
              <Avatar.Image size={60} source={{ uri: worker.profile.avatar_url }} />
            ) : (
              <Avatar.Text
                size={60}
                label={worker.profile.full_name.charAt(0).toUpperCase()}
                style={styles.avatar}
              />
            )}
            <View style={styles.headerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{worker.profile.full_name}</Text>
                {worker.verification_status === 'verified' && (
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={18}
                    color={colors.success}
                    style={styles.verifiedIcon}
                  />
                )}
              </View>
              <View style={styles.serviceRow}>
                <MaterialCommunityIcons name={serviceIcon} size={16} color={colors.primary} />
                <Text style={styles.serviceType}>{serviceLabel}</Text>
              </View>
            </View>
          </View>

          {worker.rating && (
            <View style={styles.ratingRow}>
              <MaterialCommunityIcons name="star" size={16} color={colors.warning} />
              <Text style={styles.rating}>
                {worker.rating.toFixed(1)} ({worker.total_reviews} reviews)
              </Text>
            </View>
          )}

          {worker.bio && (
            <Text style={styles.bio} numberOfLines={2}>
              {worker.bio}
            </Text>
          )}

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="briefcase" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>{worker.experience_years}+ years</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="cash" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>R{worker.hourly_rate}/hr</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="circle"
                size={12}
                color={
                  worker.availability_status === 'available'
                    ? colors.success
                    : worker.availability_status === 'busy'
                    ? colors.warning
                    : colors.error
                }
              />
              <Text style={styles.detailText}>
                {worker.availability_status === 'available'
                  ? 'Available'
                  : worker.availability_status === 'busy'
                  ? 'Busy'
                  : 'Unavailable'}
              </Text>
            </View>
          </View>

          {worker.skills && worker.skills.length > 0 && (
            <View style={styles.skillsRow}>
              {worker.skills.slice(0, 3).map((skill, index) => (
                <Chip key={index} style={styles.skillChip} textStyle={styles.skillText}>
                  {skill}
                </Chip>
              ))}
              {worker.skills.length > 3 && (
                <Text style={styles.moreSkills}>+{worker.skills.length - 3} more</Text>
              )}
            </View>
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h3,
    color: colors.text,
  },
  verifiedIcon: {
    marginLeft: spacing.xs,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceType: {
    ...typography.caption,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rating: {
    ...typography.body,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  bio: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  skillChip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    height: 28,
  },
  skillText: {
    fontSize: 12,
  },
  moreSkills: {
    ...typography.caption,
    color: colors.textSecondary,
    alignSelf: 'center',
    marginLeft: spacing.xs,
  },
});

