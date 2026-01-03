# Client Features - Quick Reference Guide

## 🎯 Overview
Complete client functionality has been added to the mobile app. Clients can now browse workers, create bookings, and leave reviews.

---

## 📂 File Structure

```
src/
├── components/client/
│   ├── WorkerCard.tsx              # Worker card for browse list
│   ├── ClientBookingCard.tsx       # Booking card for my bookings
│   └── ReviewCard.tsx              # Review display card
│
├── hooks/
│   ├── useWorkers.ts               # Worker data hooks
│   ├── useClientBookings.ts        # Client booking hooks
│   └── useReviews.ts               # Review hooks
│
├── screens/client/
│   ├── ClientDashboardScreen.tsx   # Client dashboard
│   ├── BrowseWorkersScreen.tsx     # Browse workers with search/filter
│   ├── WorkerProfileScreen.tsx     # Worker profile (client view)
│   ├── CreateBookingScreen.tsx     # Create booking form
│   ├── MyBookingsScreen.tsx        # My bookings with filters
│   └── LeaveReviewScreen.tsx       # Leave review form
│
└── navigation/
    ├── AppNavigator.tsx            # Routes based on user role
    ├── ClientNavigator.tsx         # Client tab navigation
    └── MainNavigator.tsx           # Worker tab navigation (renamed)
```

---

## 🔄 Navigation Flow

### Client Navigation Structure
```
ClientNavigator (Bottom Tabs)
├── ClientDashboard
├── BrowseWorkers (Stack)
│   ├── WorkersList
│   ├── WorkerProfile
│   ├── CreateBooking
│   └── LeaveReview
├── MyBookings (Stack)
│   └── MyBookingsList
└── Profile (Stack)
    ├── ProfileView
    └── EditProfile
```

### User Flow
```
Sign Up → Select Role (Client/Worker) → 
  If Client → ClientNavigator
  If Worker → MainNavigator (WorkerNavigator)
```

---

## 🎨 Key Components

### WorkerCard
```tsx
<WorkerCard
  worker={worker}
  onPress={() => navigate('WorkerProfile', { workerId })}
/>
```

### ClientBookingCard
```tsx
<ClientBookingCard
  booking={booking}
  onPress={() => navigate('BookingDetails', { bookingId })}
  onCancel={() => handleCancel(bookingId)}
  onReview={() => navigate('LeaveReview', { bookingId, workerId })}
/>
```

### ReviewCard
```tsx
<ReviewCard review={review} />
```

---

## 🔌 Hooks Usage

### useWorkers
```tsx
// Get all workers with optional filters
const { data: workers, isLoading } = useWorkers(serviceType, searchQuery);

// Get single worker
const { data: worker } = useWorker(workerId);

// Get worker reviews
const { data: reviews } = useWorkerReviews(workerId);
```

### useClientBookings
```tsx
// Get client's bookings
const { data: bookings } = useClientBookings(clientId);

// Get booking stats
const { data: stats } = useClientBookingStats(clientId);

// Create booking
const createBooking = useCreateBooking();
await createBooking.mutateAsync(bookingData);

// Cancel booking
const cancelBooking = useCancelBooking();
await cancelBooking.mutateAsync(bookingId);
```

### useReviews
```tsx
// Submit review
const submitReview = useSubmitReview();
await submitReview.mutateAsync(reviewData);

// Check if booking has review
const { data: review } = useBookingReview(bookingId);

// Get client's reviews
const { data: reviews } = useClientReviews(clientId);
```

---

## 🎯 Screen Features

### ClientDashboardScreen
- Welcome header with avatar
- Stats cards (active, completed, total spent)
- Recent bookings (last 5)
- "Find Workers" button

### BrowseWorkersScreen
- Search bar (name, bio, skills)
- Service type filter
- Worker cards with ratings
- Pull-to-refresh

### WorkerProfileScreen
- Profile header with avatar
- Stats (rating, experience, rate)
- About section
- Skills chips
- Reviews (first 5)
- "Book Now" button

### CreateBookingScreen
- Worker info summary
- Date/time pickers
- Location input
- Description textarea
- Estimated hours
- Auto-calculated cost
- Client contact info
- Form validation

### MyBookingsScreen
- Status filter tabs
- Booking cards
- Cancel button (pending)
- Review button (completed)
- Pull-to-refresh

### LeaveReviewScreen
- Worker info
- Star rating (1-5)
- Review textarea
- Character counter
- Guidelines card
- Form validation

---

## 🔐 Role-Based Routing

### AppNavigator Logic
```tsx
{session ? (
  profile?.role === 'client' ? (
    <Stack.Screen name="ClientMain" component={ClientNavigator} />
  ) : (
    <Stack.Screen name="WorkerMain" component={MainNavigator} />
  )
) : (
  <Stack.Screen name="Auth" component={AuthNavigator} />
)}
```

---

## 📊 Database Queries

### Workers
```sql
-- Get verified workers
SELECT * FROM worker_profiles 
WHERE verification_status = 'verified'
AND service_type = ? 
AND (full_name ILIKE ? OR bio ILIKE ? OR skills @> ?)
```

### Bookings
```sql
-- Get client bookings
SELECT * FROM bookings 
WHERE client_id = ?
ORDER BY booking_date DESC, start_time DESC
```

### Reviews
```sql
-- Get worker reviews
SELECT * FROM reviews 
WHERE worker_id = ?
ORDER BY created_at DESC
```

---

## 🎨 Theme Usage

All screens use the existing theme:
```tsx
import { colors, spacing, typography } from '../../lib/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.md,
  },
});
```

---

## ✅ Testing Commands

```bash
# Run the app
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 🐛 Common Issues & Solutions

### Issue: Navigation not working
**Solution:** Make sure navigation types are updated in `navigation.types.ts`

### Issue: Data not loading
**Solution:** Check Supabase connection and RLS policies

### Issue: Date picker not showing
**Solution:** Ensure `@react-native-community/datetimepicker` is installed

### Issue: Icons not displaying
**Solution:** Link `react-native-vector-icons` properly

---

## 📝 Next Steps

1. Test all client features thoroughly
2. Add error boundaries for better error handling
3. Implement offline support with React Query
4. Add push notifications for booking updates
5. Implement in-app messaging between clients and workers
6. Add payment integration
7. Add booking history export
8. Implement favorites/saved workers

---

## 🔗 Related Documentation

- [Main README](./README.md)
- [Client Features Implementation](./CLIENT_FEATURES_IMPLEMENTATION.md)
- [Navigation Types](./src/types/navigation.types.ts)
- [Database Types](./src/types/database.types.ts)

---

**Last Updated:** 2026-01-03

