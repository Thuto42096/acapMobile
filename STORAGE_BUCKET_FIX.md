# 🔧 Fix: Storage Upload Errors

## ✅ Issue 1: Network Request Failed - FIXED!

**Problem:** `StorageUnknownError: Network request failed`

**Root Cause:** React Native doesn't support Blob uploads to Supabase Storage.

**Solution:** Use ArrayBuffer instead of Blob - **ALREADY FIXED IN CODE!** ✅

---

## ⚠️ Issue 2: Row-Level Security Policy Error - NEEDS FIX

**Current Error:** `new row violates row-level security policy`

**Root Cause:** The storage bucket doesn't have RLS policies to allow authenticated users to upload files.

**Solution:** Add storage policies in Supabase Dashboard (see below)

---

## 🚀 Quick Fix: Add Storage Policies (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `emgjkwvpwikzkxigzruh`
3. Click **Storage** in left sidebar
4. Click on `profile-pictures` bucket

### Step 2: Add Storage Policy (EASIEST METHOD)

1. In the `profile-pictures` bucket, click **Policies** tab
2. Click **New Policy** button
3. Click **For full customization** (or **Create a policy**)
4. **Copy and paste this SQL:**

```sql
-- Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'profile-pictures')
WITH CHECK (bucket_id = 'profile-pictures');
```

5. Click **Review** then **Save policy**

### Step 3: Make Bucket Public (for viewing images)
1. Still in `profile-pictures` bucket
2. Click **Configuration** or **Settings** tab
3. Toggle **Public bucket** to **ON** ✅
4. Click **Save**

**That's it!** The upload should work now.

---

## 🎯 Alternative: Individual Policies (More Secure)

If you want more granular control, add these 4 policies instead:

**Policy 1: Allow Upload**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-pictures');
```

**Policy 2: Allow Update**
```sql
CREATE POLICY "Allow users to update own files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Policy 3: Allow Delete**
```sql
CREATE POLICY "Allow users to delete own files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Policy 4: Allow Public Read**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile-pictures');
```

---

## 🧪 Test After Adding Policy

1. **No need to reload the app** - policies take effect immediately
2. **Try upload again:** Profile → Edit Profile → Upload
3. **Check terminal logs:** Should see successful upload

Expected successful output:
```
Starting profile picture upload for user: 7c029569-8018-45a7-ac5d-8cd55ce32065
Image URI: file:///data/data/host.exp.exponent/cache/ImagePicker/...
ArrayBuffer created, size: 266593
File path: avatars/7c029569-8018-45a7-ac5d-8cd55ce32065-1765812695186.png
Uploading to Supabase Storage...
Upload response: { data: {...}, error: null }  ← Should be null!
Profile picture uploaded successfully!
```

---

## � Summary of What We Fixed

1. ✅ **Network Request Failed** → Fixed by using ArrayBuffer instead of Blob
2. ⚠️ **RLS Policy Error** → Fix by adding storage policy in Supabase (see above)

---

## 🆘 If Still Not Working After Adding Policy

1. **Verify the policy was created:**
   - Go to Storage → `profile-pictures` → Policies tab
   - You should see "Allow all for authenticated users" policy listed

2. **Check if you're authenticated:**
   - Make sure you're signed in to the app
   - The error would be different if not authenticated

3. **Try manual upload in Supabase:**
   - Go to Storage → `profile-pictures`
   - Try uploading a file manually
   - If this fails, there's a bucket configuration issue

Let me know if you need help with any of these steps!

