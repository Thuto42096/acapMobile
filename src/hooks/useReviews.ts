import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Review } from '../types/database.types';

// Check if booking has been reviewed
export const useBookingReview = (bookingId: string) => {
  return useQuery({
    queryKey: ['bookingReview', bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('booking_id', bookingId)
        .maybeSingle();

      if (error) throw error;
      return data as Review | null;
    },
    enabled: !!bookingId,
  });
};

// Submit review
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: {
      booking_id: string;
      worker_id: string;
      client_id: string;
      rating: number;
      comment?: string;
    }) => {
      // Insert review
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single();

      if (reviewError) throw reviewError;

      // Update worker's rating
      // First, get all reviews for this worker
      const { data: allReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('worker_id', review.worker_id);

      if (reviewsError) throw reviewsError;

      // Calculate new average rating
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / allReviews.length;

      // Update worker profile
      const { error: updateError } = await supabase
        .from('worker_profiles')
        .update({
          rating: averageRating,
          total_reviews: allReviews.length,
        })
        .eq('id', review.worker_id);

      if (updateError) throw updateError;

      return reviewData;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['bookingReview', data.booking_id] });
      queryClient.invalidateQueries({ queryKey: ['workerReviews', data.worker_id] });
      queryClient.invalidateQueries({ queryKey: ['worker', data.worker_id] });
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    },
  });
};

// Fetch client's reviews
export const useClientReviews = (clientId: string) => {
  return useQuery({
    queryKey: ['clientReviews', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          worker:profiles!reviews_worker_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          booking:bookings (
            id,
            booking_date,
            service_type
          )
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });
};

