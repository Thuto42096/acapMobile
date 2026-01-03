import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { ServiceType } from '../types/database.types';

export interface WorkerWithProfile {
  id: string;
  service_type: ServiceType;
  experience_years: number;
  hourly_rate: number;
  bio?: string;
  skills?: string[];
  availability_status: string;
  verification_status: string;
  rating?: number;
  total_reviews: number;
  profile: {
    id: string;
    full_name: string;
    avatar_url?: string;
    phone: string;
  };
}

// Fetch all verified workers
export const useWorkers = (serviceType?: ServiceType, searchQuery?: string) => {
  return useQuery({
    queryKey: ['workers', serviceType, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('worker_profiles')
        .select(`
          *,
          profile:profiles!inner (
            id,
            full_name,
            avatar_url,
            phone
          )
        `)
        .eq('verification_status', 'verified')
        .order('rating', { ascending: false, nullsFirst: false });

      // Filter by service type if provided
      if (serviceType) {
        query = query.eq('service_type', serviceType);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data
      const workers: WorkerWithProfile[] = (data || []).map((item: any) => ({
        id: item.id,
        service_type: item.service_type,
        experience_years: item.experience_years,
        hourly_rate: item.hourly_rate,
        bio: item.bio,
        skills: item.skills,
        availability_status: item.availability_status,
        verification_status: item.verification_status,
        rating: item.rating,
        total_reviews: item.total_reviews,
        profile: item.profile,
      }));

      // Client-side search filtering
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return workers.filter((worker) => {
          const nameMatch = worker.profile.full_name.toLowerCase().includes(query);
          const bioMatch = worker.bio?.toLowerCase().includes(query);
          const skillsMatch = worker.skills?.some((skill) =>
            skill.toLowerCase().includes(query)
          );
          return nameMatch || bioMatch || skillsMatch;
        });
      }

      return workers;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch single worker profile
export const useWorker = (workerId: string) => {
  return useQuery({
    queryKey: ['worker', workerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('worker_profiles')
        .select(`
          *,
          profile:profiles!inner (
            id,
            full_name,
            avatar_url,
            phone,
            email
          )
        `)
        .eq('id', workerId)
        .single();

      if (error) throw error;

      const worker: WorkerWithProfile = {
        id: data.id,
        service_type: data.service_type,
        experience_years: data.experience_years,
        hourly_rate: data.hourly_rate,
        bio: data.bio,
        skills: data.skills,
        availability_status: data.availability_status,
        verification_status: data.verification_status,
        rating: data.rating,
        total_reviews: data.total_reviews,
        profile: data.profile,
      };

      return worker;
    },
    enabled: !!workerId,
  });
};

// Fetch worker reviews
export const useWorkerReviews = (workerId: string) => {
  return useQuery({
    queryKey: ['workerReviews', workerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          client:profiles!reviews_client_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('worker_id', workerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!workerId,
  });
};

