import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { WorkerDocument, DocumentType } from '../types/database.types';
import * as ImagePicker from 'expo-image-picker';

// Fetch worker documents
export const useDocuments = (workerId: string) => {
  return useQuery({
    queryKey: ['documents', workerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('worker_documents')
        .select('*')
        .eq('worker_id', workerId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data as WorkerDocument[];
    },
    enabled: !!workerId,
  });
};

// Upload document to Supabase Storage and create database record
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workerId,
      documentType,
      imageUri,
    }: {
      workerId: string;
      documentType: DocumentType;
      imageUri: string;
    }) => {
      // Convert image URI to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Generate unique filename
      const fileExt = imageUri.split('.').pop();
      const fileName = `${workerId}/${documentType}_${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('worker-documents')
        .upload(fileName, blob, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('worker-documents')
        .getPublicUrl(fileName);

      // Create database record
      const { data, error } = await supabase
        .from('worker_documents')
        .insert({
          worker_id: workerId,
          document_type: documentType,
          document_url: publicUrl,
          verification_status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data as WorkerDocument;
    },
    onSuccess: (data) => {
      // Invalidate documents query to refetch
      queryClient.invalidateQueries({ queryKey: ['documents', data.worker_id] });
    },
  });
};

// Delete document
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, documentUrl }: { documentId: string; documentUrl: string }) => {
      // Extract file path from URL
      const urlParts = documentUrl.split('/worker-documents/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('worker-documents')
          .remove([filePath]);

        if (storageError) console.error('Storage deletion error:', storageError);
      }

      // Delete database record
      const { error } = await supabase
        .from('worker_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      // Invalidate all documents queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

// Request image picker permissions and pick image
export const useImagePicker = () => {
  const pickImage = async (): Promise<string | null> => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Sorry, we need camera roll permissions to upload documents!');
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  };

  return { pickImage };
};

