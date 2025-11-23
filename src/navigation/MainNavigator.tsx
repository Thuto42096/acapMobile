import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList, BookingsStackParamList, ProfileStackParamList } from '../types/navigation.types';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { BookingsListScreen } from '../screens/bookings/BookingsListScreen';
import { BookingDetailsScreen } from '../screens/bookings/BookingDetailsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { useAuth } from '../contexts/AuthContext';
import { useUnreadCount } from '../hooks/useNotifications';
import { colors } from '../lib/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator<MainTabParamList>();
const BookingsStack = createNativeStackNavigator<BookingsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const BookingsNavigator = () => {
  return (
    <BookingsStack.Navigator>
      <BookingsStack.Screen
        name="BookingsList"
        component={BookingsListScreen}
        options={{ title: 'Bookings' }}
      />
      <BookingsStack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{ title: 'Booking Details' }}
      />
    </BookingsStack.Navigator>
  );
};

const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileView"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </ProfileStack.Navigator>
  );
};

export const MainNavigator = () => {
  const { profile } = useAuth();
  const { data: unreadCount } = useUnreadCount(profile?.id || '');

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-check" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          ),
          tabBarBadge: unreadCount && unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

