# ⚠️ Important Notes - A.C.A.P Mobile

## 🔴 CRITICAL: Before Running the App

### 1. Configure Supabase Credentials

**YOU MUST UPDATE THE `.env` FILE BEFORE RUNNING THE APP!**

1. Open the `.env` file in the root directory
2. Replace the placeholder values with your actual Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

**Where to find these:**
- Go to your Supabase project dashboard
- Click "Settings" → "API"
- Copy "Project URL" and "anon/public" key

**Without valid credentials, the app will not work!**

### 2. Restart After Changing .env

After updating the `.env` file:
1. Stop the Expo server (Ctrl+C)
2. Run `npm start` again
3. The app will now use your credentials

## 📊 Database Requirements

The app expects the following tables in your Supabase database:

### Required Tables:
1. **profiles** - User profiles
   - id (uuid, primary key)
   - email (text)
   - full_name (text)
   - phone (text)
   - role (text)
   - avatar_url (text, nullable)
   - created_at (timestamp)

2. **worker_profiles** - Worker-specific data
   - id (uuid, primary key, references profiles.id)
   - service_type (text)
   - experience_years (integer)
   - hourly_rate (numeric)
   - bio (text, nullable)
   - skills (text[], nullable)
   - availability_status (text)
   - verification_status (text)
   - rating (numeric, nullable)
   - total_reviews (integer)

3. **bookings** - Booking information
   - id (uuid, primary key)
   - client_id (uuid, references profiles.id)
   - worker_id (uuid, references profiles.id)
   - service_type (text)
   - booking_date (date)
   - start_time (time)
   - end_time (time)
   - status (text)
   - location (text)
   - description (text, nullable)
   - total_amount (numeric)
   - created_at (timestamp)

4. **notifications** - User notifications
   - id (uuid, primary key)
   - user_id (uuid, references profiles.id)
   - title (text)
   - message (text)
   - type (text)
   - read (boolean)
   - created_at (timestamp)
   - data (jsonb, nullable)

5. **reviews** - Worker reviews
   - id (uuid, primary key)
   - booking_id (uuid, references bookings.id)
   - worker_id (uuid, references profiles.id)
   - client_id (uuid, references profiles.id)
   - rating (integer)
   - comment (text, nullable)
   - created_at (timestamp)

6. **worker_documents** - Document uploads
   - id (uuid, primary key)
   - worker_id (uuid, references profiles.id)
   - document_type (text)
   - document_url (text)
   - verification_status (text)
   - uploaded_at (timestamp)

**If these tables don't exist, create them in your Supabase project!**

## 🔒 Row Level Security (RLS)

Make sure RLS policies are configured in Supabase to:
- Allow workers to read their own profile
- Allow workers to update their own profile
- Allow workers to read bookings where they are the worker
- Allow workers to update booking status
- Allow workers to read their own notifications
- Allow workers to update notification read status

## 🚀 First Run Checklist

Before running the app for the first time:

- [ ] Updated `.env` with real Supabase credentials
- [ ] Verified Supabase project is active
- [ ] Confirmed database tables exist
- [ ] Checked RLS policies are configured
- [ ] Installed all dependencies (`npm install`)
- [ ] Restarted Expo server after `.env` changes

## 📱 Testing with Real Data

To properly test the app, you need:

1. **At least one worker account** - Create via sign up
2. **At least one client account** - Create in Supabase or web app
3. **Sample bookings** - Create in Supabase with:
   - Different statuses (pending, accepted, in_progress, completed)
   - Valid client_id and worker_id
   - Future dates for upcoming bookings
4. **Sample notifications** - Create in Supabase for the worker

## 🔧 Common Issues and Solutions

### "Missing Supabase environment variables"
**Solution:** Update `.env` file and restart Expo server

### "Network request failed"
**Solution:** 
- Check internet connection
- Verify Supabase URL is correct (starts with https://)
- Verify Supabase project is active

### "No bookings showing"
**Solution:** 
- Create sample bookings in Supabase
- Make sure worker_id matches your signed-in user's ID
- Check RLS policies allow reading bookings

### "Can't sign up"
**Solution:**
- Check Supabase Auth is enabled
- Verify email confirmation is disabled (or check email)
- Check RLS policies allow inserting profiles

### Icons not showing
**Solution:** Run `npx expo install` and restart

## 🎯 What Works Out of the Box

✅ Authentication (sign in, sign up, password reset)  
✅ Dashboard with statistics  
✅ Booking list and details  
✅ Booking status updates  
✅ Profile viewing  
✅ Notifications list  
✅ Offline caching  
✅ Error handling  
✅ Loading states  

## 🚧 What Needs Additional Setup

⚠️ **Push Notifications** - Requires EAS Build for production  
⚠️ **Supabase Realtime** - Needs to be enabled in Supabase project  
⚠️ **Document Upload** - Edit profile screen not yet implemented  
⚠️ **Profile Editing** - Edit profile screen not yet implemented  
⚠️ **Image Upload** - Avatar upload not yet implemented  

## 📦 Production Deployment

For production deployment:

1. **Configure EAS Build**
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```

2. **Update app.json**
   - Add your EAS project ID
   - Configure app icons
   - Configure splash screen

3. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

4. **Build for Android**
   ```bash
   eas build --platform android
   ```

5. **Submit to Stores**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## 🔐 Security Notes

- **Never commit `.env` file** - It's in .gitignore
- **Use environment variables** - Don't hardcode credentials
- **Enable RLS** - Protect your database
- **Validate on backend** - Don't trust client-side validation alone
- **Use HTTPS** - Supabase uses HTTPS by default

## 📞 Support Resources

- **Expo Docs:** https://docs.expo.dev
- **Supabase Docs:** https://supabase.com/docs
- **React Navigation:** https://reactnavigation.org
- **React Native Paper:** https://callstack.github.io/react-native-paper

## ✅ Final Checklist

Before considering the app "ready":

- [ ] `.env` configured with real credentials
- [ ] App runs without errors
- [ ] Can sign up and sign in
- [ ] Dashboard loads with data
- [ ] Can view and manage bookings
- [ ] Notifications work
- [ ] Profile displays correctly
- [ ] Tested on both iOS and Android
- [ ] All features tested per TESTING_GUIDE.md

---

**Remember: The app shares the same Supabase backend with the web application. Any changes to the database affect both platforms!**

