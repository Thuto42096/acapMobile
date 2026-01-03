import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ClientTabParamList,
  ClientBookingsStackParamList,
  BrowseWorkersStackParamList,
  ProfileStackParamList,
} from '../types/navigation.types';
import { ClientDashboardScreen } from '../screens/client/ClientDashboardScreen';
import { BrowseWorkersScreen } from '../screens/client/BrowseWorkersScreen';
import { WorkerProfileScreen } from '../screens/client/WorkerProfileScreen';
import { CreateBookingScreen } from '../screens/client/CreateBookingScreen';
import { MyBookingsScreen } from '../screens/client/MyBookingsScreen';
import { LeaveReviewScreen } from '../screens/client/LeaveReviewScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { colors } from '../lib/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator<ClientTabParamList>();
const BrowseWorkersStack = createNativeStackNavigator<BrowseWorkersStackParamList>();
const MyBookingsStack = createNativeStackNavigator<ClientBookingsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// Browse Workers Stack Navigator
const BrowseWorkersNavigator = () => {
  return (
    <BrowseWorkersStack.Navigator>
      <BrowseWorkersStack.Screen
        name="WorkersList"
        component={BrowseWorkersScreen}
        options={{ title: 'Find Workers' }}
      />
      <BrowseWorkersStack.Screen
        name="WorkerProfile"
        component={WorkerProfileScreen}
        options={{ title: 'Worker Profile' }}
      />
      <BrowseWorkersStack.Screen
        name="CreateBooking"
        component={CreateBookingScreen}
        options={{ title: 'Create Booking' }}
      />
      <BrowseWorkersStack.Screen
        name="LeaveReview"
        component={LeaveReviewScreen}
        options={{ title: 'Leave Review' }}
      />
    </BrowseWorkersStack.Navigator>
  );
};

// My Bookings Stack Navigator
const MyBookingsNavigator = () => {
  return (
    <MyBookingsStack.Navigator>
      <MyBookingsStack.Screen
        name="MyBookingsList"
        component={MyBookingsScreen}
        options={{ title: 'My Bookings' }}
      />
    </MyBookingsStack.Navigator>
  );
};

// Profile Stack Navigator (reused from worker)
const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileView"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
    </ProfileStack.Navigator>
  );
};

// Client Tab Navigator
export const ClientNavigator = () => {
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
        name="ClientDashboard"
        component={ClientDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BrowseWorkers"
        component={BrowseWorkersNavigator}
        options={{
          title: 'Find Workers',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsNavigator}
        options={{
          title: 'My Bookings',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-check" size={size} color={color} />
          ),
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

