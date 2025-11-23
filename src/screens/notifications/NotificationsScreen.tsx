import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../hooks/useNotifications';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { formatTimeAgo } from '../../utils/formatters';
import { colors, spacing, typography } from '../../lib/theme';

export const NotificationsScreen = ({ navigation }: any) => {
  const { profile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const { data: notifications, isLoading, error, refetch } = useNotifications(profile?.id || '');
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: any) => {
    if (!notification.read) {
      await markAsRead.mutateAsync(notification.id);
    }

    // Navigate based on notification type
    if (notification.type === 'booking_request' || notification.type === 'booking_update') {
      if (notification.data?.bookingId) {
        navigation.navigate('BookingDetails', { bookingId: notification.data.bookingId });
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (profile?.id) {
      await markAllAsRead.mutateAsync(profile.id);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      booking_request: '📋',
      booking_update: '🔔',
      review: '⭐',
      system: 'ℹ️',
    };
    return icons[type] || '🔔';
  };

  if (isLoading && !refreshing) {
    return <LoadingSpinner message="Loading notifications..." />;
  }

  if (error && !refreshing) {
    return <ErrorMessage message={error.message} onRetry={handleRefresh} />;
  }

  const notificationsList = notifications || [];
  const hasUnread = notificationsList.some((n) => !n.read);

  return (
    <View style={styles.container}>
      {hasUnread && (
        <View style={styles.header}>
          <Button mode="text" onPress={handleMarkAllAsRead} compact>
            Mark all as read
          </Button>
        </View>
      )}

      <FlatList
        data={notificationsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleNotificationPress(item)} activeOpacity={0.7}>
            <Card style={[styles.card, !item.read && styles.unreadCard]}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{getNotificationIcon(item.type)}</Text>
                </View>
                <View style={styles.content}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.message} numberOfLines={2}>
                    {item.message}
                  </Text>
                  <Text style={styles.time}>{formatTimeAgo(item.created_at)}</Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="🔔"
            title="No Notifications"
            message="You don't have any notifications yet."
          />
        }
        contentContainerStyle={
          notificationsList.length === 0 ? styles.emptyContainer : styles.listContent
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    padding: spacing.sm,
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  card: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    elevation: 1,
  },
  unreadCard: {
    backgroundColor: `${colors.primary}05`,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  time: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
  },
});

