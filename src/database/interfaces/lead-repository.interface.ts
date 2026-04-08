import { CreateLeadDto } from '../dto/create-lead.dto';
import { Lead } from '../entities/lead.entity';

export const LEAD_REPOSITORY = 'LEAD_REPOSITORY';

export interface ILeadRepository {
  /**
   * Persists a new lead to the data store.
   * @returns The created Lead domain object.
   */
  createLead(data: CreateLeadDto): Promise<Lead>;
}
