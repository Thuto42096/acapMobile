import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, Chip } from 'react-native-paper';
import { PublicWorkerProfile } from '../../hooks/usePublicProfiles';
import { colors, spacing, typography } from '../../lib/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface WorkerProfileCardProps {
  profile: PublicWorkerProfile;
  onPress?: () => void;
}

const getServiceTypeLabel = (serviceType: string): string => {
  const labels: Record<string, string> = {
    domestic_worker: 'Domestic Worker',
    gardener: 'Gardener',
    plumber: 'Plumber',
    handyman: 'Handyman',
  };
  return labels[serviceType] || serviceType;
};

const getServiceTypeIcon = (serviceType: string): string => {
  const icons: Record<string, string> = {
    domestic_worker: 'broom',
    gardener: 'flower',
    plumber: 'pipe-wrench',
    handyman: 'hammer-wrench',
  };
  return icons[serviceType] || 'account';
};

const getAvailabilityColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    available: colors.success,
    busy: colors.warning,
    unavailable: colors.error,
  };
  return statusColors[status] || colors.textSecondary;
};

export const WorkerProfileCard: React.FC<WorkerProfileCardProps> = ({ profile, onPress }) => {
  const { profile: userProfile, workerProfile } = profile;

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            {userProfile.avatar_url ? (
              <Avatar.Image
                size={60}
                source={{ uri: userProfile.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Text
                size={60}
                label={userProfile.full_name?.charAt(0) || 'W'}
                style={styles.avatar}
              />
            )}
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{userProfile.full_name}</Text>
              <View style={styles.serviceRow}>
                <MaterialCommunityIcons
                  name={getServiceTypeIcon(workerProfile.service_type)}
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.serviceType}>
                  {getServiceTypeLabel(workerProfile.service_type)}
                </Text>
              </View>
              <View style={styles.ratingRow}>
                <MaterialCommunityIcons name="star" size={16} color={colors.warning} />
                <Text style={styles.rating}>
                  {workerProfile.rating?.toFixed(1) || 'N/A'}
                </Text>
                <Text style={styles.reviews}>({workerProfile.total_reviews} reviews)</Text>
              </View>
            </View>
          </View>

          {workerProfile.bio && (
            <Text style={styles.bio} numberOfLines={2}>
              {workerProfile.bio}
            </Text>
          )}

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="briefcase" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>{workerProfile.experience_years} years exp.</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="cash" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>R {workerProfile.hourly_rate}/hr</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="circle"
                size={12}
                color={getAvailabilityColor(workerProfile.availability_status)}
              />
              <Text style={styles.detailText}>
                {workerProfile.availability_status.charAt(0).toUpperCase() +
                  workerProfile.availability_status.slice(1)}
              </Text>
            </View>
          </View>

          {workerProfile.skills && workerProfile.skills.length > 0 && (
            <View style={styles.skillsContainer}>
              {workerProfile.skills.slice(0, 3).map((skill, index) => (
                <Chip key={index} mode="outlined" style={styles.skillChip} compact>
                  {skill}
                </Chip>
              ))}
              {workerProfile.skills.length > 3 && (
                <Text style={styles.moreSkills}>+{workerProfile.skills.length - 3} more</Text>
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
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
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
  name: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.xs,
  },
  serviceType: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  reviews: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  bio: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  skillChip: {
    height: 28,
  },
  moreSkills: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});

