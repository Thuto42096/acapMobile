# 🚀 Quick Start Guide - A.C.A.P Mobile

Get the A.C.A.P Mobile app running in 5 minutes!

## Step 1: Configure Supabase

1. Open the `.env` file in the root directory
2. Replace the placeholder values with your actual Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these values:**
- Go to your Supabase project dashboard
- Click on "Settings" → "API"
- Copy the "Project URL" and "anon/public" key

## Step 2: Start the App

Run the following command:

```bash
npm start
```

This will start the Expo development server and show a QR code.

## Step 3: Choose Your Platform

### Option A: Physical Device (Recommended)

1. **iOS:** 
   - Install "Expo Go" from the App Store
   - Open the Camera app and scan the QR code
   
2. **Android:**
   - Install "Expo Go" from the Play Store
   - Open Expo Go and scan the QR code

### Option B: Emulator/Simulator

1. **iOS Simulator (Mac only):**
   - Press `i` in the terminal
   
2. **Android Emulator:**
   - Make sure Android Studio is installed with an emulator
   - Press `a` in the terminal

## Step 4: Test the App

### Sign Up as a Worker

1. On the sign-in screen, tap "Sign Up"
2. Fill in the form:
   - Full Name: Your name
   - Email: your.email@example.com
   - Phone: 0123456789
   - Password: At least 6 characters
3. Tap "Sign Up"

### Explore the Dashboard

After signing up, you'll see:
- Welcome message with your name
- Availability toggle
- Statistics cards (pending, upcoming, earnings, rating)
- Recent bookings list

### Test Bookings

1. Tap on the "Bookings" tab at the bottom
2. View bookings by status (Pending, Upcoming, Active, Completed)
3. Tap on a booking to see details
4. Accept/decline bookings or update their status

### Check Notifications

1. Tap on the "Notifications" tab
2. View all notifications
3. Tap on a notification to navigate to the related booking

### View Profile

1. Tap on the "Profile" tab
2. View your profile information
3. Tap "Edit Profile" to update your details
4. Tap "Sign Out" to log out

## 🎉 You're All Set!

The app is now running and connected to your Supabase backend.

## 🔧 Troubleshooting

### "Missing Supabase environment variables"
- Make sure you updated the `.env` file with real credentials
- Restart the Expo server: Press `Ctrl+C` and run `npm start` again

### "Network request failed"
- Check your internet connection
- Verify the Supabase URL is correct (should start with `https://`)
- Make sure your Supabase project is active

### App won't load on device
- Make sure your phone and computer are on the same Wi-Fi network
- Try restarting the Expo server
- Check if Expo Go app is up to date

### Icons not showing
- Run: `npx expo install`
- Restart the app

## 📱 Next Steps

1. **Create Test Data:** Add some bookings in your Supabase database to test the app
2. **Test Notifications:** Set up Supabase Realtime to test real-time updates
3. **Customize:** Update colors, logos, and branding in `src/lib/theme.ts`
4. **Deploy:** Use EAS Build to create production builds for App Store/Play Store

## 🆘 Need Help?

- Check the full README.md for detailed documentation
- Review the code in `src/` directory
- Check Expo documentation: https://docs.expo.dev
- Check Supabase documentation: https://supabase.com/docs

Happy coding! 🎉

