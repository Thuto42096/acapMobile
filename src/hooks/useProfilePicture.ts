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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

      // Convert image URI to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Generate unique filename
      const fileExt = imageUri.split('.').pop() || 'jpg';
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Delete old avatar if exists
      if (profile.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('profile-pictures')
            .remove([`avatars/${oldPath}`]);
        }
      }

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

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

