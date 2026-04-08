export type LeadSource =
  | 'facebook_message'
  | 'facebook_comment'
  | 'tiktok'
  | 'website';

export interface Lead {
  id: string;
  source: LeadSource;
  platform_user_id: string | null;
  sender_name: string | null;
  raw_message: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  name: string | null;
  created_at: string;
}
