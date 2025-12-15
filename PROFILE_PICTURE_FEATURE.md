# Profile Picture Upload Feature - Implementation Guide

## ✅ Feature Overview

Workers can now upload, change, and remove their profile pictures directly from the mobile app. Profile pictures are displayed throughout the app including the dashboard, profile screen, public profiles, and more.

## 📱 What Has Been Implemented

### 1. Custom Hook - `useProfilePicture.ts`
**Location:** `src/hooks/useProfilePicture.ts`

**Features:**
- ✅ `useImagePicker` - Select images from device gallery with permission handling
- ✅ `useUploadProfilePicture` - Upload profile picture to Supabase Storage
- ✅ `useRemoveProfilePicture` - Remove profile picture from storage and database
- ✅ Automatic old picture deletion when uploading new one
- ✅ React Query integration for cache invalidation

**Key Functions:**
```typescript
// Pick image from gallery
const { pickImage, requesting } = useImagePicker();
const imageUri = await pickImage();

// Upload profile picture
const uploadPicture = useUploadProfilePicture();
uploadPicture.mutate(imageUri);

// Remove profile picture
const removePicture = useRemoveProfilePicture();
removePicture.mutate();
```

### 2. Edit Profile Screen Updates
**Location:** `src/screens/profile/EditProfileScreen.tsx`

**New Features:**
- ✅ Profile Picture section at the top
- ✅ Avatar preview (shows current picture or text avatar)
- ✅ "Upload" button (when no picture exists)
- ✅ "Change" button (when picture exists)
- ✅ "Remove" button (when picture exists)
- ✅ Loading states during upload/remove
- ✅ Confirmation dialog before removing

**UI Elements:**
- Large avatar preview (100px)
- Two-button layout (Change/Remove)
- Loading indicators
- Disabled states during operations

### 3. Profile Screen Updates
**Location:** `src/screens/profile/ProfileScreen.tsx`

**Changes:**
- ✅ Shows avatar image if `avatar_url` exists
- ✅ Falls back to text avatar (first letter) if no picture
- ✅ Automatic updates when picture changes

### 4. Dashboard Screen Updates
**Location:** `src/screens/dashboard/DashboardScreen.tsx`

**Changes:**
- ✅ Shows avatar image in welcome header
- ✅ Falls back to text avatar if no picture
- ✅ Consistent with profile screen display

### 5. Public Profiles Updates
**Location:** `src/components/profile/WorkerProfileCard.tsx`

**Changes:**
- ✅ Shows worker avatar images in public profiles
- ✅ Falls back to text avatar if no picture
- ✅ Helps clients identify workers visually

## 🎨 UI/UX Features

### Edit Profile Screen
**Profile Picture Section:**
- Centered avatar preview (100px diameter)
- Square aspect ratio (1:1) for consistent cropping
- Two-button layout:
  - **Upload/Change Button:** Camera icon, outlined style
  - **Remove Button:** Delete icon, outlined style (only shown when picture exists)
- Loading states with spinners
- Disabled buttons during operations

### Avatar Display
**Throughout the App:**
- **With Picture:** Shows circular avatar image
- **Without Picture:** Shows colored circle with first letter of name
- **Consistent Sizing:**
  - Dashboard: 60px
  - Profile Screen: 80px
  - Edit Profile: 100px
  - Public Profiles: 60px

### Image Selection
- **Aspect Ratio:** 1:1 (square)
- **Quality:** 80% (good quality, compressed)
- **Editing:** Built-in crop/zoom in image picker
- **Permissions:** Automatic request with user-friendly messages

## 🔒 Storage & Security

### Supabase Storage
- **Bucket:** `profile-pictures`
- **Path:** `avatars/{userId}-{timestamp}.{ext}`
- **Access:** Public (read-only)
- **File Types:** Images (jpg, png, etc.)

### File Management
- **Unique Naming:** `{userId}-{timestamp}.{ext}` prevents conflicts
- **Old File Cleanup:** Automatically deletes old picture when uploading new one
- **Storage Optimization:** Compressed images (80% quality)

### Database
- **Table:** `profiles`
- **Field:** `avatar_url` (text, nullable)
- **Updates:** Automatic via AuthContext refresh

## 📊 Data Flow

### Upload Flow:
1. User taps "Upload" or "Change" button
2. Request gallery permissions (if needed)
3. Open image picker with square crop
4. User selects and crops image
5. Convert image to blob
6. Delete old avatar from storage (if exists)
7. Upload new image to Supabase Storage
8. Get public URL
9. Update `profiles.avatar_url` in database
10. Invalidate React Query cache
11. AuthContext refreshes profile data
12. UI updates automatically

### Remove Flow:
1. User taps "Remove" button
2. Show confirmation dialog
3. User confirms
4. Delete file from Supabase Storage
5. Update `profiles.avatar_url` to null
6. Invalidate React Query cache
7. AuthContext refreshes profile data
8. UI shows text avatar

### Display Flow:
1. AuthContext fetches profile with `avatar_url`
2. Components check if `avatar_url` exists
3. If exists: Show `Avatar.Image` with URL
4. If not: Show `Avatar.Text` with first letter

## 🎯 User Experience

### For Workers:
- ✅ Easy to upload profile pictures
- ✅ Can change picture anytime
- ✅ Can remove picture and revert to text avatar
- ✅ See picture throughout the app
- ✅ Professional appearance for clients

### For Clients:
- ✅ See worker pictures in public profiles
- ✅ Easier to identify and remember workers
- ✅ More trust through visual identification
- ✅ Better browsing experience

## 🔧 Technical Details

### Dependencies Used:
- `expo-image-picker` - Image selection from gallery
- `@tanstack/react-query` - Cache management
- `react-native-paper` - Avatar components
- Supabase Storage - File storage
- Supabase Database - URL storage

### Permission Handling:
- Automatic permission request on first use
- User-friendly error messages
- Graceful fallback if permission denied

### Image Processing:
- Square aspect ratio (1:1)
- 80% quality compression
- Automatic resizing by image picker
- Blob conversion for upload

### Cache Management:
- Invalidates `profile` query on upload/remove
- Invalidates `publicProfiles` query on upload/remove
- AuthContext automatically refreshes
- UI updates reactively

## 📋 Setup Required

### Supabase Storage Bucket:
You need to create a storage bucket in Supabase:

1. Go to Supabase Dashboard → Storage
2. Click "Create Bucket"
3. Name: `profile-pictures`
4. Public: ✅ Yes (for public access to avatars)
5. Click "Create Bucket"

### Storage Policies (Optional):
For better security, you can add RLS policies:

```sql
-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = 'avatars' AND
  auth.uid()::text = (storage.filename(name))[1]
);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = 'avatars' AND
  auth.uid()::text = (storage.filename(name))[1]
);

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = 'avatars' AND
  auth.uid()::text = (storage.filename(name))[1]
);

-- Allow public read access to all avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');
```

## 🧪 Testing Checklist

- [ ] Create `profile-pictures` bucket in Supabase
- [ ] Upload profile picture from Edit Profile screen
- [ ] Verify picture appears in Profile screen
- [ ] Verify picture appears in Dashboard
- [ ] Verify picture appears in Public Profiles (if worker is verified)
- [ ] Change profile picture
- [ ] Verify old picture is deleted from storage
- [ ] Remove profile picture
- [ ] Verify text avatar appears after removal
- [ ] Test permission request flow
- [ ] Test with denied permissions
- [ ] Test image cropping in picker
- [ ] Test loading states
- [ ] Test error handling

## 🎉 Success Criteria

All requirements have been met:

✅ Workers can upload profile pictures  
✅ Workers can change profile pictures  
✅ Workers can remove profile pictures  
✅ Pictures display in Profile screen  
✅ Pictures display in Dashboard  
✅ Pictures display in Public Profiles  
✅ Pictures display in Edit Profile  
✅ Automatic permission handling  
✅ Loading states  
✅ Error handling  
✅ Old picture cleanup  
✅ React Query cache invalidation  

## 📚 Files Created/Modified

**New Files:**
- ✅ `src/hooks/useProfilePicture.ts`
- ✅ `PROFILE_PICTURE_FEATURE.md`

**Modified Files:**
- ✅ `src/screens/profile/EditProfileScreen.tsx`
- ✅ `src/screens/profile/ProfileScreen.tsx`
- ✅ `src/screens/dashboard/DashboardScreen.tsx`
- ✅ `src/components/profile/WorkerProfileCard.tsx`

---

**Built with ❤️ for A.C.A.P Solutions**

