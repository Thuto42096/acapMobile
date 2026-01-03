import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  PublicProfiles: undefined;
};

// Worker Tab Navigator
export type WorkerTabParamList = {
  Dashboard: undefined;
  Bookings: undefined;
  Profile: undefined;
  Notifications: undefined;
};

// Client Tab Navigator
export type ClientTabParamList = {
  ClientDashboard: undefined;
  BrowseWorkers: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

// Bookings Stack (Worker)
export type BookingsStackParamList = {
  BookingsList: undefined;
  BookingDetails: { bookingId: string };
};

// Client Bookings Stack
export type ClientBookingsStackParamList = {
  MyBookingsList: undefined;
  MyBookingDetails: { bookingId: string };
};

// Browse Workers Stack
export type BrowseWorkersStackParamList = {
  WorkersList: undefined;
  WorkerProfile: { workerId: string };
  CreateBooking: { workerId: string };
  LeaveReview: { bookingId: string; workerId: string };
};

// Profile Stack
export type ProfileStackParamList = {
  ProfileView: undefined;
  EditProfile: undefined;
  DocumentUpload: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  WorkerMain: NavigatorScreenParams<WorkerTabParamList>;
  ClientMain: NavigatorScreenParams<ClientTabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

