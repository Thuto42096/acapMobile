import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Profile, WorkerProfile, ServiceType } from '../types/database.types';

export interface PublicWorkerProfile {
  profile: Profile;
  workerProfile: WorkerProfile;
}

// Fetch all public worker profiles
export const usePublicProfiles = (serviceType?: ServiceType) => {
  return useQuery({
    queryKey: ['publicProfiles', serviceType],
    queryFn: async () => {
      // Build query
      let query = supabase
        .from('worker_profiles')
        .select(`
          *,
          profiles:id (
            id,
            full_name,
            avatar_url,
            created_at
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

      // Transform data to match our interface
      const profiles: PublicWorkerProfile[] = (data || []).map((item: any) => ({
        profile: item.profiles,
        workerProfile: {
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
        },
      }));

      return profiles;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch single public worker profile
export const usePublicProfile = (workerId: string) => {
  return useQuery({
    queryKey: ['publicProfile', workerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('worker_profiles')
        .select(`
          *,
          profiles:id (
            id,
            full_name,
            avatar_url,
            created_at
          )
        `)
        .eq('id', workerId)
        .single();

      if (error) throw error;

      const profile: PublicWorkerProfile = {
        profile: data.profiles,
        workerProfile: {
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
        },
      };

      return profile;
    },
    enabled: !!workerId,
  });
};

