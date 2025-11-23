# A.C.A.P Mobile - Worker App

React Native mobile application for A.C.A.P Solutions workers (domestic workers, gardeners, plumbers, handymen).

## 🚀 Features

- **Worker Authentication** - Sign in, sign up, password reset
- **Dashboard** - View statistics, bookings, and availability status
- **Booking Management** - Accept/decline bookings, update status, view details
- **Profile Management** - View and edit worker profile
- **Notifications** - Real-time notifications for new bookings and updates
- **Offline Support** - Cached data with React Query

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app on your physical device (optional)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Get these values from your existing Supabase project (same as web app).

### 3. Run the App

Start the development server:

```bash
npm start
```

Then choose your platform:
- Press `i` for iOS Simulator (Mac only)
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

## 📱 Running on Physical Device

1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Run `npm start`
3. Scan the QR code with your camera (iOS) or Expo Go app (Android)

## 🏗️ Project Structure

```
acap-mobile/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── auth/        # Authentication components
│   │   ├── booking/     # Booking-related components
│   │   ├── profile/     # Profile components
│   │   └── common/      # Common components (LoadingSpinner, etc.)
│   ├── screens/         # Screen components
│   │   ├── auth/        # Auth screens (SignIn, SignUp, etc.)
│   │   ├── dashboard/   # Dashboard screen
│   │   ├── bookings/    # Booking screens
│   │   ├── profile/     # Profile screens
│   │   └── notifications/ # Notifications screen
│   ├── navigation/      # Navigation configuration
│   ├── lib/            # Libraries and utilities
│   │   ├── supabase.ts # Supabase client
│   │   └── theme.ts    # App theme
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── assets/             # Images, icons, fonts
├── App.tsx            # Root component
├── app.json           # Expo configuration
└── package.json       # Dependencies
```

## 🎨 Tech Stack

- **Framework:** Expo (React Native)
- **Language:** TypeScript
- **Backend:** Supabase (shared with web app)
- **Navigation:** React Navigation v6
- **UI Library:** React Native Paper
- **State Management:** React Context + TanStack React Query
- **Notifications:** Expo Notifications + Supabase Realtime

## 🔧 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator (Mac only)
- `npm run web` - Run in web browser

## 📊 Database

The app uses the **existing Supabase database** from the web application. No database changes are required.

### Required Tables:
- `profiles` - User profiles
- `worker_profiles` - Worker-specific data
- `bookings` - Booking information
- `notifications` - User notifications
- `reviews` - Worker reviews
- `worker_documents` - Document uploads

## 🔐 Authentication

The app uses Supabase Authentication with email/password. Sessions are persisted using AsyncStorage.

## 🔔 Notifications

Push notifications are configured using Expo Notifications. Real-time updates use Supabase Realtime subscriptions.

## 🚧 Development Notes

1. **Environment Variables:** Make sure `.env` file is configured before running
2. **Supabase Connection:** Use the same Supabase project as the web app
3. **Testing:** Test on both iOS and Android for best results
4. **Hot Reload:** Changes will automatically reload in development mode

## 📝 Next Steps

1. Configure your Supabase credentials in `.env`
2. Run `npm start` to start development
3. Test authentication flow
4. Test booking management features
5. Configure push notifications (requires EAS Build for production)

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists and contains valid credentials
- Restart the Expo server after changing `.env`

### "Network request failed"
- Check your internet connection
- Verify Supabase URL and API key are correct
- Check if Supabase project is active

### Icons not showing
- Run `npx expo install` to ensure all dependencies are properly linked

## 📄 License

Copyright © 2024 A.C.A.P Solutions. All rights reserved.

