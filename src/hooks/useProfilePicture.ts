import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for selecting images from device
 */
export const useImagePicker = () => {
  const [requesting, setRequesting] = useState(false);

  const pickImage = async (): Promise<string | null> => {
    try {
      setRequesting(true);

      // Request permissions
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Please grant camera roll permissions to upload a profile picture.'
          );
          return null;
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for profile pictures
        quality: 0.8, // Good quality but compressed
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
      return null;
    } finally {
      setRequesting(false);
    }
  };

  return { pickImage, requesting };
};

/**
 * Hook for uploading profile picture to Supabase Storage
 */
export const useUploadProfilePicture = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageUri: string) => {
      if (!profile?.id) {
        throw new Error('User not authenticated');
      }

      console.log('Starting profile picture upload for user:', profile.id);
      console.log('Image URI:', imageUri);

      // For React Native, we need to use ArrayBuffer instead of Blob
      // Fetch the image and convert to ArrayBuffer
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);

      // Generate unique filename
      // Detect file extension from URI or default to jpg
      const uriParts = imageUri.split('.');
      const fileExt = uriParts[uriParts.length - 1].split('?')[0] || 'jpg';
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      console.log('File path:', filePath, 'Extension:', fileExt);

      // Delete old avatar if exists
      if (profile.avatar_url) {
        console.log('Deleting old avatar:', profile.avatar_url);
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath) {
          const { error: deleteError } = await supabase.storage
            .from('profile-pictures')
            .remove([`avatars/${oldPath}`]);
          if (deleteError) {
            console.warn('Failed to delete old avatar:', deleteError);
          }
        }
      }

      // Upload to Supabase Storage using ArrayBuffer (required for React Native)
      console.log('Uploading to Supabase Storage...');
      console.log('Bucket: profile-pictures, Path:', filePath);

      // Determine content type from file extension
      const contentType = fileExt === 'png' ? 'image/png' :
                         fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' :
                         'image/jpeg'; // default

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, arrayBuffer, {
          contentType,
          upsert: false,
        });

      console.log('Upload response:', { data: uploadData, error: uploadError });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        if (uploadError.message.includes('Bucket not found')) {
          throw new Error('Storage bucket not set up. Please create "profile-pictures" bucket in Supabase.');
        }
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);
      console.log('Public URL:', publicUrl);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      console.log('Profile picture uploaded successfully!');
      return publicUrl;
    },
    onSuccess: () => {
      // Invalidate queries to refresh profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['publicProfiles'] });
    },
    onError: (error: Error) => {
      Alert.alert('Upload Failed', error.message);
    },
  });
};

/**
 * Hook for removing profile picture
 */
export const useRemoveProfilePicture = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!profile?.id) {
        throw new Error('User not authenticated');
      }

      if (!profile.avatar_url) {
        throw new Error('No profile picture to remove');
      }

      // Delete from storage
      const fileName = profile.avatar_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('profile-pictures')
          .remove([`avatars/${fileName}`]);
      }

      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', profile.id);

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }
    },
    onSuccess: () => {
      // Invalidate queries to refresh profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['publicProfiles'] });
    },
    onError: (error: Error) => {
      Alert.alert('Remove Failed', error.message);
    },
  });
};

