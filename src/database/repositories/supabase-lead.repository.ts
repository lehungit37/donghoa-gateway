import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateLeadDto } from '../dto/create-lead.dto';
import { Lead } from '../entities/lead.entity';
import { ILeadRepository } from '../interfaces/lead-repository.interface';

@Injectable()
export class SupabaseLeadRepository implements ILeadRepository, OnModuleInit {
  private readonly logger = new Logger(SupabaseLeadRepository.name);
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !key) {
      this.logger.error(
        'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured.',
      );
      return;
    }

    this.supabase = createClient(url, key);
    this.logger.log('Supabase client initialized.');
  }

  async createLead(data: CreateLeadDto): Promise<Lead> {
    if (!this.supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data: inserted, error } = await this.supabase
      .from('leads')
      .insert({
        source: data.source,
        platform_user_id: data.platform_user_id ?? null,
        sender_name: data.sender_name ?? null,
        raw_message: data.raw_message ?? null,
        phone: data.phone ?? null,
        email: data.email ?? null,
        address: data.address ?? null,
        name: data.name ?? null,
      })
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to insert lead: ${error.message}`, error);
      throw new Error(`Database insert failed: ${error.message}`);
    }

    return inserted as Lead;
  }
}
