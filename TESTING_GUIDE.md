# 🧪 Testing Guide - A.C.A.P Mobile

Complete testing checklist for the A.C.A.P Mobile worker app.

## Prerequisites

Before testing, ensure:
- [ ] `.env` file is configured with valid Supabase credentials
- [ ] Supabase database has the required tables
- [ ] App is running on a device or emulator
- [ ] Internet connection is available

## 1. Authentication Testing

### Sign Up Flow
- [ ] Open the app (should show Sign In screen)
- [ ] Tap "Sign Up"
- [ ] Test validation:
  - [ ] Try submitting empty form (should show errors)
  - [ ] Try invalid email format (should show error)
  - [ ] Try short password < 6 chars (should show error)
  - [ ] Try mismatched passwords (should show error)
  - [ ] Try invalid phone number (should show error)
- [ ] Fill in valid information:
  - Full Name: Test Worker
  - Email: test.worker@example.com
  - Phone: 0123456789
  - Password: password123
  - Confirm Password: password123
- [ ] Tap "Sign Up"
- [ ] Should navigate to Dashboard automatically

### Sign In Flow
- [ ] Sign out from the app
- [ ] Should return to Sign In screen
- [ ] Test validation:
  - [ ] Try invalid email (should show error)
  - [ ] Try empty password (should show error)
  - [ ] Try wrong credentials (should show error)
- [ ] Sign in with correct credentials
- [ ] Should navigate to Dashboard

### Password Reset
- [ ] On Sign In screen, tap "Forgot Password?"
- [ ] Enter email address
- [ ] Tap "Send Reset Link"
- [ ] Should show success message
- [ ] Check email for reset link (if email is configured in Supabase)

### Session Persistence
- [ ] Sign in to the app
- [ ] Close the app completely
- [ ] Reopen the app
- [ ] Should automatically be signed in (no need to sign in again)

## 2. Dashboard Testing

### Initial Load
- [ ] Dashboard loads successfully
- [ ] Shows welcome message with worker name
- [ ] Shows avatar with first letter of name
- [ ] Shows availability toggle
- [ ] Shows 4 statistics cards (Pending, Upcoming, Earnings, Rating)
- [ ] Shows "Recent Bookings" section

### Availability Toggle
- [ ] Toggle availability to "Available"
- [ ] Should update immediately
- [ ] Pull down to refresh
- [ ] Status should persist after refresh
- [ ] Toggle to "Unavailable"
- [ ] Should update immediately

### Statistics Cards
- [ ] Verify pending bookings count
- [ ] Verify upcoming bookings count
- [ ] Verify earnings display (R 0.00 if no bookings)
- [ ] Verify rating display (N/A if no reviews)

### Recent Bookings
- [ ] If no bookings: Shows "No bookings yet"
- [ ] If bookings exist: Shows up to 5 recent bookings
- [ ] Each booking card shows:
  - [ ] Client name and avatar
  - [ ] Service type
  - [ ] Date and time
  - [ ] Location
  - [ ] Amount
  - [ ] Status badge
- [ ] Tap "View All" button
- [ ] Should navigate to Bookings screen

### Pull to Refresh
- [ ] Pull down on dashboard
- [ ] Should show loading indicator
- [ ] Should refresh all data

## 3. Bookings Testing

### Bookings List
- [ ] Navigate to Bookings tab
- [ ] Should show segmented buttons: Pending, Upcoming, Active, Completed
- [ ] Tap each tab and verify filtering works
- [ ] If no bookings: Shows empty state with message
- [ ] If bookings exist: Shows list of booking cards

### Booking Card
- [ ] Each card displays:
  - [ ] Client avatar and name
  - [ ] Service type
  - [ ] Date and time
  - [ ] Location
  - [ ] Amount
  - [ ] Status badge with correct color
- [ ] Tap on a booking card
- [ ] Should navigate to Booking Details

### Booking Details - Pending Status
- [ ] Shows status badge at top
- [ ] Shows client information:
  - [ ] Avatar, name, phone
  - [ ] "Call Client" button
- [ ] Shows booking details:
  - [ ] Service type
  - [ ] Date
  - [ ] Time (start - end)
  - [ ] Location
  - [ ] Description (if exists)
  - [ ] Total amount
- [ ] Shows action buttons:
  - [ ] "Accept Booking" button (green)
  - [ ] "Decline" button (red outline)
- [ ] Tap "Call Client"
  - [ ] Should open phone dialer with client's number
- [ ] Tap "Open in Maps"
  - [ ] Should open maps app with location
- [ ] Tap "Accept Booking"
  - [ ] Should show confirmation dialog
  - [ ] Confirm action
  - [ ] Status should update to "Accepted"
  - [ ] Action buttons should change

### Booking Details - Accepted Status
- [ ] Shows "Accepted" status badge
- [ ] Shows action buttons:
  - [ ] "Start Job" button
  - [ ] "Cancel Booking" button
- [ ] Tap "Start Job"
  - [ ] Should show confirmation
  - [ ] Status should update to "In Progress"

### Booking Details - In Progress Status
- [ ] Shows "In Progress" status badge
- [ ] Shows action button:
  - [ ] "Complete Job" button
- [ ] Tap "Complete Job"
  - [ ] Should show confirmation
  - [ ] Status should update to "Completed"

### Booking Details - Completed Status
- [ ] Shows "Completed" status badge
- [ ] No action buttons shown
- [ ] All booking information still visible

## 4. Notifications Testing

### Notifications List
- [ ] Navigate to Notifications tab
- [ ] If no notifications: Shows empty state
- [ ] If notifications exist:
  - [ ] Shows list of notification cards
  - [ ] Unread notifications have:
    - [ ] Light background color
    - [ ] Orange left border
    - [ ] Blue dot indicator
  - [ ] Read notifications have normal appearance

### Notification Card
- [ ] Each card shows:
  - [ ] Icon based on type
  - [ ] Title
  - [ ] Message (truncated to 2 lines)
  - [ ] Time ago (e.g., "2 hours ago")
- [ ] Tap on unread notification
  - [ ] Should mark as read
  - [ ] Should navigate to related screen (if applicable)

### Mark All as Read
- [ ] If unread notifications exist:
  - [ ] "Mark all as read" button appears at top
  - [ ] Tap button
  - [ ] All notifications should be marked as read
  - [ ] Button should disappear

### Tab Badge
- [ ] Notifications tab shows badge with unread count
- [ ] Badge updates when notifications are read
- [ ] Badge disappears when all are read

## 5. Profile Testing

### Profile View
- [ ] Navigate to Profile tab
- [ ] Shows profile header:
  - [ ] Avatar with first letter
  - [ ] Full name
  - [ ] Email
  - [ ] Service type chip
  - [ ] Verification status badge
  - [ ] "Edit Profile" button
- [ ] Shows contact information:
  - [ ] Phone number (formatted)
  - [ ] Email
- [ ] Shows professional information:
  - [ ] Experience years
  - [ ] Hourly rate
  - [ ] Rating and review count
  - [ ] Bio (if exists)
  - [ ] Skills (if exist)

### Sign Out
- [ ] Scroll to bottom
- [ ] Tap "Sign Out" button
- [ ] Should show confirmation dialog
- [ ] Confirm sign out
- [ ] Should navigate to Sign In screen
- [ ] Session should be cleared

## 6. Error Handling Testing

### Network Errors
- [ ] Turn off internet connection
- [ ] Try to load dashboard
- [ ] Should show error message with "Try Again" button
- [ ] Turn on internet
- [ ] Tap "Try Again"
- [ ] Should load successfully

### Invalid Credentials
- [ ] Try signing in with wrong password
- [ ] Should show error message in snackbar
- [ ] Error should auto-dismiss after 3 seconds

### Empty States
- [ ] Test each screen with no data:
  - [ ] Dashboard with no bookings
  - [ ] Bookings list with no bookings
  - [ ] Notifications with no notifications
- [ ] Each should show appropriate empty state message

## 7. UI/UX Testing

### Loading States
- [ ] All screens show loading spinner while fetching data
- [ ] Loading spinner has message (e.g., "Loading bookings...")
- [ ] Loading is smooth and doesn't flicker

### Pull to Refresh
- [ ] Works on Dashboard
- [ ] Works on Bookings List
- [ ] Works on Notifications
- [ ] Shows loading indicator
- [ ] Refreshes data successfully

### Navigation
- [ ] Bottom tabs work correctly
- [ ] Back button works on detail screens
- [ ] Navigation is smooth without lag
- [ ] Tab bar highlights active tab

### Responsive Design
- [ ] Test on different screen sizes
- [ ] All text is readable
- [ ] Buttons are easily tappable
- [ ] Cards don't overflow
- [ ] Images scale properly

## 8. Performance Testing

### App Launch
- [ ] App launches in < 3 seconds
- [ ] No white screen flash
- [ ] Smooth transition to first screen

### Screen Transitions
- [ ] Navigation is smooth (60 FPS)
- [ ] No lag when switching tabs
- [ ] No lag when opening detail screens

### Data Loading
- [ ] Lists load quickly
- [ ] Images load without blocking UI
- [ ] Cached data loads instantly

### Memory Usage
- [ ] App doesn't crash after extended use
- [ ] No memory leaks
- [ ] Smooth scrolling in long lists

## ✅ Testing Checklist Summary

- [ ] All authentication flows work
- [ ] Dashboard displays correctly
- [ ] Bookings can be viewed and managed
- [ ] Notifications work properly
- [ ] Profile displays correctly
- [ ] Error handling works
- [ ] UI is responsive and smooth
- [ ] Performance is acceptable
- [ ] No crashes or freezes

## 🐛 Bug Reporting

If you find any issues, document:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots (if applicable)
5. Device/OS version
6. App version

## 📝 Notes

- Some features require actual data in Supabase (bookings, notifications)
- Push notifications require production build (EAS Build)
- Real-time updates require Supabase Realtime configuration
- Document upload feature is not yet implemented

Happy testing! 🎉

