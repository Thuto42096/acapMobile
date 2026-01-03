import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Booking, BookingStatus, ServiceType } from '../types/database.types';

// Fetch client bookings
export const useClientBookings = (clientId: string, status?: BookingStatus) => {
  return useQuery({
    queryKey: ['clientBookings', clientId, status],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          worker:profiles!bookings_worker_id_fkey (
            id,
            full_name,
            avatar_url,
            phone
          ),
          worker_profile:worker_profiles!bookings_worker_id_fkey (
            service_type,
            hourly_rate,
            rating
          )
        `)
        .eq('client_id', clientId)
        .order('booking_date', { ascending: false });

      // Filter by status if provided
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!clientId,
  });
};

// Fetch single booking
export const useClientBooking = (bookingId: string) => {
  return useQuery({
    queryKey: ['clientBooking', bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          worker:profiles!bookings_worker_id_fkey (
            id,
            full_name,
            avatar_url,
            phone,
            email
          ),
          worker_profile:worker_profiles!bookings_worker_id_fkey (
            service_type,
            hourly_rate,
            rating,
            total_reviews
          )
        `)
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      return data as Booking;
    },
    enabled: !!bookingId,
  });
};

// Create booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: {
      client_id: string;
      worker_id: string;
      service_type: ServiceType;
      booking_date: string;
      start_time: string;
      end_time: string;
      location: string;
      description?: string;
      total_amount: number;
    }) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...booking,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate client bookings query
      queryClient.invalidateQueries({ queryKey: ['clientBookings', data.client_id] });
    },
  });
};

// Cancel booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['clientBookings', data.client_id] });
      queryClient.invalidateQueries({ queryKey: ['clientBooking', data.id] });
    },
  });
};

// Get client booking stats
export const useClientBookingStats = (clientId: string) => {
  return useQuery({
    queryKey: ['clientBookingStats', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('status, total_amount')
        .eq('client_id', clientId);

      if (error) throw error;

      const stats = {
        active: data.filter((b) => ['pending', 'accepted', 'in_progress'].includes(b.status)).length,
        completed: data.filter((b) => b.status === 'completed').length,
        cancelled: data.filter((b) => b.status === 'cancelled').length,
        totalSpent: data
          .filter((b) => b.status === 'completed')
          .reduce((sum, b) => sum + (b.total_amount || 0), 0),
      };

      return stats;
    },
    enabled: !!clientId,
  });
};

