// Database types matching Supabase schema

export type UserRole = 'client' | 'worker' | 'admin';

export type ServiceType = 'domestic_worker' | 'gardener' | 'plumber' | 'handyman';

export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export type DocumentType = 'id' | 'certificate' | 'police_clearance';

export type NotificationType = 'booking_request' | 'booking_update' | 'review' | 'system';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface WorkerProfile {
  id: string;
  service_type: ServiceType;
  experience_years: number;
  hourly_rate: number;
  bio?: string;
  skills?: string[];
  availability_status: AvailabilityStatus;
  verification_status: VerificationStatus;
  rating?: number;
  total_reviews: number;
}

export interface Booking {
  id: string;
  client_id: string;
  worker_id: string;
  service_type: ServiceType;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  location: string;
  description?: string;
  total_amount: number;
  created_at: string;
  // Joined data
  client?: Profile;
  worker?: Profile;
}

export interface Review {
  id: string;
  booking_id: string;
  worker_id: string;
  client_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  // Joined data
  client?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
  data?: any;
}

export interface WorkerDocument {
  id: string;
  worker_id: string;
  document_type: DocumentType;
  document_url: string;
  verification_status: VerificationStatus;
  uploaded_at: string;
}

// Combined worker data
export interface WorkerData {
  profile: Profile;
  workerProfile: WorkerProfile;
  documents: WorkerDocument[];
}

