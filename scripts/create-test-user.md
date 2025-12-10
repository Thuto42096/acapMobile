# Create Test User for Development

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** → **"Create new user"**
4. Fill in:
   - **Email**: `test@acap.com`
   - **Password**: `Test123!`
   - **Auto Confirm User**: ✅ (check this box)
5. Click **"Create user"**

6. After user is created, go to **Table Editor** → **profiles** table
7. Find the row with the email `test@acap.com`
8. Edit the row and set:
   - **full_name**: `Test Worker`
   - **phone**: `0123456789`
   - **role**: `worker`

9. Go to **Table Editor** → **worker_profiles** table
10. Click **"Insert"** → **"Insert row"**
11. Fill in:
    - **id**: (copy the user ID from the profiles table)
    - **service_type**: `domestic_worker`
    - **experience_years**: `5`
    - **hourly_rate**: `150`
    - **bio**: `Test worker for development`
    - **skills**: `["Cleaning", "Cooking", "Laundry"]`
    - **availability_status**: `available`
    - **verification_status**: `verified`

## Option 2: Using SQL (Faster)

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL:

```sql
-- Note: Replace 'YOUR_USER_ID_HERE' with the actual user ID after creating the auth user
-- First, create the auth user manually through the dashboard (steps 1-5 above)
-- Then get the user ID and run this:

-- Update the profile
UPDATE profiles 
SET 
  full_name = 'Test Worker',
  phone = '0123456789',
  role = 'worker'
WHERE email = 'test@acap.com';

-- Insert worker profile (replace the ID with your actual user ID)
INSERT INTO worker_profiles (
  id,
  service_type,
  experience_years,
  hourly_rate,
  bio,
  skills,
  availability_status,
  verification_status
) VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with actual user ID
  'domestic_worker',
  5,
  150,
  'Test worker for development',
  ARRAY['Cleaning', 'Cooking', 'Laundry'],
  'available',
  'verified'
);
```

## Test Credentials

Once set up, use these credentials in the app:

- **Email**: `test@acap.com`
- **Password**: `Test123!`

## Quick Login in App

1. Open the app
2. On the Sign In screen, tap **"Fill Test Credentials"** button
3. Tap **"Sign In"**

Done! 🎉

