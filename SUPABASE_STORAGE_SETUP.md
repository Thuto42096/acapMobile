# Supabase Storage Setup for Document Upload

## 🎯 Quick Setup Guide

This guide will help you set up the Supabase Storage bucket required for the Document Upload feature.

## Step 1: Create Storage Bucket

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your A.C.A.P project

2. **Navigate to Storage**
   - Click on **Storage** in the left sidebar
   - You'll see the Storage Buckets page

3. **Create New Bucket**
   - Click the **New Bucket** button
   - Enter the following details:
     - **Name:** `worker-documents`
     - **Public bucket:** Toggle ON (recommended for easier access)
     - **File size limit:** Leave default or set to 5MB
     - **Allowed MIME types:** Leave empty or add: `image/jpeg, image/png, image/jpg`
   - Click **Create Bucket**

## Step 2: Configure Bucket Policies (Optional but Recommended)

For better security, set up Row Level Security (RLS) policies:

### Option A: Using Supabase Dashboard

1. Click on the `worker-documents` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Create the following policies:

#### Policy 1: Allow Upload
- **Policy Name:** Workers can upload own documents
- **Allowed operation:** INSERT
- **Target roles:** authenticated
- **USING expression:**
  ```sql
  bucket_id = 'worker-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
  ```

#### Policy 2: Allow View
- **Policy Name:** Workers can view own documents
- **Allowed operation:** SELECT
- **Target roles:** authenticated
- **USING expression:**
  ```sql
  bucket_id = 'worker-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
  ```

#### Policy 3: Allow Delete
- **Policy Name:** Workers can delete own documents
- **Allowed operation:** DELETE
- **Target roles:** authenticated
- **USING expression:**
  ```sql
  bucket_id = 'worker-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
  ```

### Option B: Using SQL Editor

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Paste and run the following SQL:

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

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

-- Allow public read access (if bucket is public)
CREATE POLICY "Public can view documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'worker-documents');
```

## Step 3: Verify Setup

1. **Check Bucket Exists**
   - Go to Storage → Buckets
   - Verify `worker-documents` bucket is listed
   - Check that it shows as "Public" if you enabled public access

2. **Test Upload (Optional)**
   - Click on the `worker-documents` bucket
   - Try uploading a test image manually
   - Verify you can see the uploaded file
   - Delete the test file

## Step 4: Update App Configuration (Already Done)

The app is already configured to use the `worker-documents` bucket. No code changes needed!

The upload hook (`src/hooks/useDocuments.ts`) uses:
```typescript
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('worker-documents')  // ← This is the bucket name
  .upload(fileName, blob, {
    contentType: `image/${fileExt}`,
    upsert: false,
  });
```

## 🔒 Security Considerations

### Public vs Private Bucket

**Public Bucket (Recommended for this use case):**
- ✅ Easier to implement
- ✅ Direct URL access to images
- ✅ Faster loading
- ⚠️ Anyone with the URL can view the document
- ⚠️ URLs are predictable

**Private Bucket (More Secure):**
- ✅ More secure
- ✅ Requires authentication to access
- ❌ Requires signed URLs (more complex)
- ❌ URLs expire after a set time

### Recommended Approach
1. Use **Public Bucket** for initial implementation
2. Implement RLS policies to control who can upload/delete
3. Consider switching to Private Bucket in production if handling sensitive documents

## 🧪 Testing the Setup

After setup, test the feature:

1. **Open the Mobile App**
   - Navigate to Profile tab
   - Tap "Manage Documents"

2. **Upload a Test Document**
   - Tap "Upload" for ID Document
   - Select an image from your gallery
   - Wait for upload to complete

3. **Verify in Supabase**
   - Go to Storage → worker-documents
   - You should see a folder with your user ID
   - Inside, you should see the uploaded image

4. **Check Database**
   - Go to Table Editor → worker_documents
   - You should see a new record with:
     - worker_id (your user ID)
     - document_type ('id')
     - document_url (public URL)
     - verification_status ('pending')

## ❌ Troubleshooting

### Error: "Bucket not found"
- **Solution:** Make sure the bucket name is exactly `worker-documents` (lowercase, with hyphen)

### Error: "Permission denied"
- **Solution:** Check that RLS policies are set up correctly or disable RLS for testing

### Error: "File too large"
- **Solution:** Check bucket file size limit settings

### Images not displaying
- **Solution:** 
  - Verify bucket is set to Public
  - Check that the document_url in database is correct
  - Try accessing the URL directly in a browser

### Upload fails silently
- **Solution:**
  - Check browser/app console for errors
  - Verify Supabase credentials in `.env` file
  - Check network connection

## 📚 Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Storage RLS](https://supabase.com/docs/guides/storage/security/access-control)
- [Expo Image Picker Documentation](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

## ✅ Setup Complete!

Once you've completed these steps, the Document Upload feature is ready to use!

Workers can now:
- Upload ID documents
- Upload certificates
- Upload police clearance
- View uploaded documents
- Delete and re-upload documents
- See verification status

---

**Need Help?** Check the DOCUMENT_UPLOAD_FEATURE.md file for detailed implementation information.

