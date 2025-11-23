import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Booking, BookingStatus } from '../types/database.types';

export const useBookings = (workerId: string, status?: BookingStatus) => {
  return useQuery({
    queryKey: ['bookings', workerId, status],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(*)
        `)
        .eq('worker_id', workerId)
        .order('booking_date', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!workerId,
  });
};

export const useBooking = (bookingId: string) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(*),
          worker:profiles!bookings_worker_id_fkey(*)
        `)
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      return data as Booking;
    },
    enabled: !!bookingId,
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: BookingStatus }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking'] });
    },
  });
};

export const useBookingStats = (workerId: string) => {
  return useQuery({
    queryKey: ['bookingStats', workerId],
    queryFn: async () => {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('worker_id', workerId);

      if (error) throw error;

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats = {
        pending: bookings.filter((b) => b.status === 'pending').length,
        upcoming: bookings.filter(
          (b) => b.status === 'accepted' && new Date(b.booking_date) >= now
        ).length,
        completed: bookings.filter((b) => b.status === 'completed').length,
        totalEarningsThisMonth: bookings
          .filter(
            (b) =>
              b.status === 'completed' &&
              new Date(b.created_at) >= thisMonth
          )
          .reduce((sum, b) => sum + b.total_amount, 0),
      };

      return stats;
    },
    enabled: !!workerId,
  });
};

