import { Global, Module } from '@nestjs/common';
import { LEAD_REPOSITORY } from './interfaces/lead-repository.interface';
import { SupabaseLeadRepository } from './repositories/supabase-lead.repository';

@Global()
@Module({
  providers: [
    {
      provide: LEAD_REPOSITORY,
      useClass: SupabaseLeadRepository,
    },
  ],
  exports: [LEAD_REPOSITORY],
})
export class DatabaseModule {}
