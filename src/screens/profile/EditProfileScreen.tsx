import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Card, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { colors, spacing, typography } from '../../lib/theme';
import { validatePhone, validateRequired } from '../../utils/validators';
import { ServiceType } from '../../types/database.types';

export const EditProfileScreen = ({ navigation }: any) => {
  const { profile, workerProfile, updateProfile, updateWorkerProfile } = useAuth();
  
  // Profile state
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  
  // Worker profile state
  const [serviceType, setServiceType] = useState<ServiceType>(
    workerProfile?.service_type || 'domestic_worker'
  );
  const [experienceYears, setExperienceYears] = useState(
    workerProfile?.experience_years?.toString() || '0'
  );
  const [hourlyRate, setHourlyRate] = useState(
    workerProfile?.hourly_rate?.toString() || '0'
  );
  const [bio, setBio] = useState(workerProfile?.bio || '');
  const [skills, setSkills] = useState(
    (workerProfile?.skills && Array.isArray(workerProfile.skills))
      ? workerProfile.skills.join(', ')
      : ''
  );
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(fullName)) {
      newErrors.fullName = 'Full name is required';
    }

    if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    const expYears = parseInt(experienceYears);
    if (isNaN(expYears) || expYears < 0 || expYears > 50) {
      newErrors.experienceYears = 'Please enter valid years of experience (0-50)';
    }

    const rate = parseFloat(hourlyRate);
    if (isNaN(rate) || rate < 0 || rate > 10000) {
      newErrors.hourlyRate = 'Please enter a valid hourly rate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }

    setLoading(true);
    try {
      // Update profile
      await updateProfile({
        full_name: fullName,
        phone: phone,
      });

      // Update worker profile if it exists
      if (workerProfile) {
        const skillsArray = skills
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        await updateWorkerProfile({
          service_type: serviceType,
          experience_years: parseInt(experienceYears),
          hourly_rate: parseFloat(hourlyRate),
          bio: bio || undefined,
          skills: skillsArray.length > 0 ? skillsArray : undefined,
        });
      }

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Updating profile..." />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Personal Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            mode="outlined"
            style={styles.input}
            error={!!errors.fullName}
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            error={!!errors.phone}
            placeholder="0123456789"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          <TextInput
            label="Email"
            value={profile?.email || ''}
            mode="outlined"
            style={styles.input}
            editable={false}
          />
          <Text style={styles.helperText}>Email cannot be changed</Text>
        </Card.Content>
      </Card>

      {/* Professional Information */}
      {workerProfile && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Professional Information</Text>

            <Text style={styles.label}>Service Type</Text>
            <SegmentedButtons
              value={serviceType}
              onValueChange={(value) => setServiceType(value as ServiceType)}
              buttons={[
                { value: 'domestic_worker', label: 'Domestic' },
                { value: 'gardener', label: 'Gardener' },
                { value: 'plumber', label: 'Plumber' },
                { value: 'handyman', label: 'Handyman' },
              ]}
              style={styles.segmentedButtons}
            />

            <TextInput
              label="Years of Experience"
              value={experienceYears}
              onChangeText={setExperienceYears}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              error={!!errors.experienceYears}
            />
            {errors.experienceYears && (
              <Text style={styles.errorText}>{errors.experienceYears}</Text>
            )}

            <TextInput
              label="Hourly Rate (R)"
              value={hourlyRate}
              onChangeText={setHourlyRate}
              mode="outlined"
              keyboardType="decimal-pad"
              style={styles.input}
              error={!!errors.hourlyRate}
            />
            {errors.hourlyRate && (
              <Text style={styles.errorText}>{errors.hourlyRate}</Text>
            )}

            <TextInput
              label="Bio"
              value={bio}
              onChangeText={setBio}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              placeholder="Tell clients about yourself and your experience..."
            />

            <TextInput
              label="Skills (comma separated)"
              value={skills}
              onChangeText={setSkills}
              mode="outlined"
              multiline
              numberOfLines={2}
              style={styles.input}
              placeholder="e.g., Cleaning, Cooking, Laundry"
            />
          </Card.Content>
        </Card>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          loading={loading}
          disabled={loading}
        >
          Save Changes
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          disabled={loading}
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  card: {
    margin: spacing.md,
    marginBottom: 0,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  input: {
    marginBottom: spacing.sm,
  },
  segmentedButtons: {
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  buttonContainer: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    borderColor: colors.border,
  },
});

