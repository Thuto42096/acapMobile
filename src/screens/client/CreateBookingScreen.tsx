import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../contexts/AuthContext';
import { useWorker } from '../../hooks/useWorkers';
import { useCreateBooking } from '../../hooks/useClientBookings';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { colors, spacing, typography } from '../../lib/theme';

export const CreateBookingScreen = ({ route, navigation }: any) => {
  const { workerId } = route.params;
  const { profile } = useAuth();
  const { data: worker, isLoading } = useWorker(workerId);
  const createBooking = useCreateBooking();

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('4');
  const [loading, setLoading] = useState(false);

  if (isLoading || !worker) {
    return <LoadingSpinner />;
  }

  const estimatedCost = parseFloat(estimatedHours || '0') * worker.hourly_rate;

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please describe the work needed');
      return;
    }
    if (!estimatedHours || parseFloat(estimatedHours) <= 0) {
      Alert.alert('Error', 'Please enter valid estimated hours');
      return;
    }

    setLoading(true);
    try {
      // Format date and time
      const bookingDate = date.toISOString().split('T')[0];
      const startTime = `${time.getHours().toString().padStart(2, '0')}:${time
        .getMinutes()
        .toString()
        .padStart(2, '0')}:00`;
      
      // Calculate end time
      const endDate = new Date(time);
      endDate.setHours(endDate.getHours() + parseFloat(estimatedHours));
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}:00`;

      await createBooking.mutateAsync({
        client_id: profile!.id,
        worker_id: workerId,
        service_type: worker.service_type,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        location: location.trim(),
        description: description.trim(),
        total_amount: estimatedCost,
      });

      Alert.alert('Success', 'Booking request sent successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('ClientDashboard'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Worker Info */}
      <Card style={styles.workerCard}>
        <Card.Content>
          <Text style={styles.workerName}>{worker.profile.full_name}</Text>
          <Text style={styles.workerInfo}>
            {worker.service_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} • R
            {worker.hourly_rate}/hr
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.form}>
        {/* Date Picker */}
        <Text style={styles.label}>Date *</Text>
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          icon="calendar"
          style={styles.pickerButton}
        >
          {date.toLocaleDateString('en-ZA', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Time Picker */}
        <Text style={styles.label}>Time *</Text>
        <Button
          mode="outlined"
          onPress={() => setShowTimePicker(true)}
          icon="clock-outline"
          style={styles.pickerButton}
        >
          {time.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
        </Button>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        {/* Location */}
        <TextInput
          label="Location *"
          value={location}
          onChangeText={setLocation}
          mode="outlined"
          placeholder="Enter full address"
          style={styles.input}
        />

        {/* Description */}
        <TextInput
          label="Service Description *"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          placeholder="Describe the work you need done..."
          style={styles.input}
        />

        {/* Estimated Hours */}
        <TextInput
          label="Estimated Hours *"
          value={estimatedHours}
          onChangeText={setEstimatedHours}
          mode="outlined"
          keyboardType="numeric"
          placeholder="4"
          style={styles.input}
        />

        {/* Estimated Cost */}
        <Card style={styles.costCard}>
          <Card.Content>
            <Text style={styles.costLabel}>Estimated Cost</Text>
            <Text style={styles.costValue}>R{estimatedCost.toFixed(2)}</Text>
            <Text style={styles.costNote}>
              {estimatedHours} hours × R{worker.hourly_rate}/hr
            </Text>
          </Card.Content>
        </Card>

        {/* Contact Info */}
        <Card style={styles.contactCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Your Contact Information</Text>
            <Text style={styles.contactText}>Name: {profile?.full_name}</Text>
            <Text style={styles.contactText}>Phone: {profile?.phone}</Text>
            <Text style={styles.contactText}>Email: {profile?.email}</Text>
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        >
          Submit Booking Request
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
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  pickerButton: {
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  costCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.primary + '10',
  },
  costLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  costValue: {
    ...typography.h1,
    color: colors.primary,
    marginVertical: spacing.xs,
  },
  costNote: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  contactCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  contactText: {
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

