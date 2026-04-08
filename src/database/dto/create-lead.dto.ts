import { LeadSource } from '../entities/lead.entity';

export interface CreateLeadDto {
  source: LeadSource;
  platform_user_id?: string;
  sender_name?: string;
  raw_message?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  name?: string | null;
}
