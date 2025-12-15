# Document Upload Feature - Implementation Guide

## ✅ Feature Overview

The Document Upload feature allows workers to upload verification documents (ID, certificates, police clearance) directly from the mobile app. Documents are stored in Supabase Storage and tracked in the database with verification status.

## 📱 What Has Been Implemented

### 1. Custom Hook - `useDocuments.ts`
**Location:** `src/hooks/useDocuments.ts`

**Features:**
- ✅ `useDocuments` - Fetch all documents for a worker
- ✅ `useUploadDocument` - Upload document to Supabase Storage and create database record
- ✅ `useDeleteDocument` - Delete document from storage and database
- ✅ `useImagePicker` - Handle image selection with permissions

**Key Functions:**
```typescript
// Fetch documents
const { data: documents, isLoading } = useDocuments(workerId);

// Upload document
const uploadMutation = useUploadDocument();
await uploadMutation.mutateAsync({ workerId, documentType, imageUri });

// Delete document
const deleteMutation = useDeleteDocument();
await deleteMutation.mutateAsync({ documentId, documentUrl });

// Pick image
const { pickImage } = useImagePicker();
const imageUri = await pickImage();
```

### 2. Document Upload Screen
**Location:** `src/screens/profile/DocumentUploadScreen.tsx`

**Features:**
- ✅ Display three document types: ID, Certificates, Police Clearance
- ✅ Upload button for each document type
- ✅ Image picker integration with permissions
- ✅ Display uploaded documents with thumbnails
- ✅ Show verification status badges (Pending, Verified, Rejected)
- ✅ Delete functionality for uploaded documents
- ✅ Loading states and error handling
- ✅ Responsive UI with Material Design

**UI Components:**
- Info card with upload instructions
- Document type cards with icons
- Upload buttons with loading states
- Document thumbnails (60x60)
- Verification status chips
- Delete buttons

### 3. Navigation Integration
**Updated Files:**
- `src/types/navigation.types.ts` - Added `DocumentUpload` to ProfileStackParamList
- `src/navigation/MainNavigator.tsx` - Added DocumentUploadScreen to ProfileNavigator
- `src/screens/profile/ProfileScreen.tsx` - Added "Manage Documents" button

**Navigation Flow:**
```
Profile Tab → Profile Screen → Manage Documents → Document Upload Screen
```

### 4. Profile Screen Updates
**Location:** `src/screens/profile/ProfileScreen.tsx`

**Changes:**
- ✅ Added "Documents" section card
- ✅ Added "Manage Documents" button with file-upload icon
- ✅ Informative text about document requirements

## 🗄️ Database Schema

The feature uses the existing `worker_documents` table:

```sql
CREATE TABLE worker_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID REFERENCES profiles(id) NOT NULL,
  document_type TEXT NOT NULL, -- 'id', 'certificate', 'police_clearance'
  document_url TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

## 📦 Supabase Storage Setup

**IMPORTANT:** You need to create a storage bucket in Supabase:

### Step 1: Create Storage Bucket
1. Go to your Supabase Dashboard
2. Navigate to **Storage** section
3. Click **New Bucket**
4. Bucket name: `worker-documents`
5. Set as **Public** bucket (for easy access to uploaded documents)
6. Click **Create Bucket**

### Step 2: Set Storage Policies (Optional)
For better security, you can set Row Level Security policies:

```sql
-- Allow workers to upload their own documents
CREATE POLICY "Workers can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'worker-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow workers to view their own documents
CREATE POLICY "Workers can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'worker-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow workers to delete their own documents
CREATE POLICY "Workers can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'worker-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## 🎨 UI/UX Features

### Document Types
1. **ID Document** - Government-issued identification
2. **Certificates** - Professional certifications and qualifications
3. **Police Clearance** - Background check certificate

### Verification Status Badges
- **Pending** (Orange) - Document uploaded, awaiting review
- **Verified** (Green) - Document approved by admin
- **Rejected** (Red) - Document rejected, needs re-upload

### User Experience
- Clear instructions at the top
- Icon-based document type identification
- Thumbnail previews of uploaded documents
- Upload date display
- Confirmation dialogs for deletion
- Loading indicators during upload/delete
- Error messages with retry options

## 📱 Permissions Required

The app requests the following permissions:
- **Media Library Access** - To select images from device gallery

Permissions are requested automatically when user taps "Upload" button.

## 🔧 Technical Implementation

### File Upload Process
1. User taps "Upload" button
2. Request media library permissions
3. Launch image picker with quality optimization (0.8)
4. Convert selected image to blob
5. Generate unique filename: `{workerId}/{documentType}_{timestamp}.{ext}`
6. Upload to Supabase Storage bucket `worker-documents`
7. Get public URL of uploaded file
8. Create database record with document metadata
9. Invalidate React Query cache to refresh UI

### File Deletion Process
1. User taps "Delete" button
2. Show confirmation dialog
3. Extract file path from document URL
4. Delete file from Supabase Storage
5. Delete database record
6. Invalidate React Query cache to refresh UI

## 📋 Testing Checklist

Before using in production, test the following:

- [ ] Create `worker-documents` storage bucket in Supabase
- [ ] Set bucket to public or configure RLS policies
- [ ] Test uploading ID document
- [ ] Test uploading certificate
- [ ] Test uploading police clearance
- [ ] Verify document thumbnails display correctly
- [ ] Test deleting a document
- [ ] Verify permissions request works on iOS
- [ ] Verify permissions request works on Android
- [ ] Test with denied permissions
- [ ] Test with poor network connection
- [ ] Verify verification status badges display correctly
- [ ] Test navigation from Profile to Document Upload
- [ ] Verify uploaded documents persist after app restart

## 🚀 Usage Instructions

### For Workers:
1. Open the app and navigate to **Profile** tab
2. Scroll down to **Documents** section
3. Tap **Manage Documents** button
4. For each document type:
   - Tap **Upload** button
   - Grant media library permissions if prompted
   - Select image from gallery
   - Wait for upload to complete
5. View uploaded documents with verification status
6. Delete and re-upload if needed

### For Admins (Future Enhancement):
- Admin dashboard to review uploaded documents
- Approve/reject documents
- Update verification status
- View document history

## 🔄 Future Enhancements

Potential improvements for future versions:
- [ ] Camera integration for direct photo capture
- [ ] Document expiry date tracking
- [ ] Multiple file upload per document type
- [ ] PDF document support
- [ ] Image compression before upload
- [ ] Progress indicator during upload
- [ ] Document preview/zoom functionality
- [ ] Push notifications when verification status changes
- [ ] Document renewal reminders
- [ ] Admin panel for document verification

## 📦 Dependencies Used

All dependencies are already installed:
- `expo-image-picker` - Image selection from gallery
- `@supabase/supabase-js` - Supabase client for storage and database
- `@tanstack/react-query` - Data fetching and caching
- `react-native-paper` - UI components

## 🎉 Success Criteria

All Phase 2, Feature #2 requirements have been met:

✅ Workers can upload ID documents  
✅ Workers can upload certificates  
✅ Workers can upload police clearance  
✅ Documents stored in Supabase Storage  
✅ Document metadata tracked in database  
✅ Verification status tracking  
✅ Delete functionality  
✅ Responsive UI  
✅ Error handling  
✅ Loading states  
✅ Permission management  

---

**Built with ❤️ for A.C.A.P Solutions**

