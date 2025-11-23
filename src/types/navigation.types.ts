import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Dashboard: undefined;
  Bookings: undefined;
  Profile: undefined;
  Notifications: undefined;
};

// Bookings Stack
export type BookingsStackParamList = {
  BookingsList: undefined;
  BookingDetails: { bookingId: string };
};

// Profile Stack
export type ProfileStackParamList = {
  ProfileView: undefined;
  EditProfile: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

