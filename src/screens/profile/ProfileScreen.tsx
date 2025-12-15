import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Avatar, Chip, Divider } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatPhoneNumber } from '../../utils/formatters';
import { colors, spacing, typography } from '../../lib/theme';

export const ProfileScreen = ({ navigation }: any) => {
  const { profile, workerProfile, signOut, loading } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to sign out');
          }
        },
      },
    ]);
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      domestic_worker: 'Domestic Worker',
      gardener: 'Gardener',
      plumber: 'Plumber',
      handyman: 'Handyman',
    };
    return labels[type] || type;
  };

  const getVerificationBadge = (status: string) => {
    const config = {
      verified: { label: 'Verified', color: colors.success },
      pending: { label: 'Pending', color: colors.warning },
      rejected: { label: 'Rejected', color: colors.error },
    };
    const badge = config[status as keyof typeof config] || config.pending;
    return (
      <Chip
        mode="flat"
        style={{ backgroundColor: `${badge.color}20` }}
        textStyle={{ color: badge.color, fontWeight: '600' }}
      >
        {badge.label}
      </Chip>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          {profile?.avatar_url ? (
            <Avatar.Image
              size={80}
              source={{ uri: profile.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text
              size={80}
              label={profile?.full_name?.charAt(0) || 'W'}
              style={styles.avatar}
            />
          )}
          <Text style={styles.name}>{profile?.full_name}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
          {workerProfile && (
            <View style={styles.badges}>
              <Chip mode="outlined" style={styles.chip}>
                {getServiceTypeLabel(workerProfile.service_type)}
              </Chip>
              {getVerificationBadge(workerProfile.verification_status)}
            </View>
          )}
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        </Card.Content>
      </Card>

      {/* Profile Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{formatPhoneNumber(profile?.phone || '')}</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profile?.email}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Worker Information */}
      {workerProfile && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Professional Information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoValue}>{workerProfile.experience_years} years</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Hourly Rate</Text>
              <Text style={styles.infoValue}>R {workerProfile.hourly_rate}/hr</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rating</Text>
              <Text style={styles.infoValue}>
                ⭐ {workerProfile.rating?.toFixed(1) || 'N/A'} ({workerProfile.total_reviews} reviews)
              </Text>
            </View>

            {workerProfile.bio && (
              <>
                <Divider style={styles.divider} />
                <Text style={styles.infoLabel}>Bio</Text>
                <Text style={styles.bio}>{workerProfile.bio}</Text>
              </>
            )}

            {workerProfile.skills && workerProfile.skills.length > 0 && (
              <>
                <Divider style={styles.divider} />
                <Text style={styles.infoLabel}>Skills</Text>
                <View style={styles.skillsContainer}>
                  {workerProfile.skills.map((skill, index) => (
                    <Chip key={index} mode="outlined" style={styles.skillChip}>
                      {skill}
                    </Chip>
                  ))}
                </View>
              </>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Documents Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Documents</Text>
          <Text style={styles.infoText}>
            Upload your ID, certificates, and police clearance for verification
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('DocumentUpload')}
            style={styles.documentsButton}
            icon="file-upload"
          >
            Manage Documents
          </Button>
        </Card.Content>
      </Card>

      {/* Sign Out Button */}
      <Button
        mode="outlined"
        onPress={handleSignOut}
        style={styles.signOutButton}
        textColor={colors.error}
      >
        Sign Out
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerCard: {
    margin: spacing.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.primary,
    marginBottom: spacing.md,
  },
  name: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  chip: {
    margin: spacing.xs,
  },
  editButton: {
    marginTop: spacing.sm,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    marginVertical: spacing.xs,
  },
  bio: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  skillChip: {
    margin: spacing.xs,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  documentsButton: {
    marginTop: spacing.sm,
  },
  signOutButton: {
    margin: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
