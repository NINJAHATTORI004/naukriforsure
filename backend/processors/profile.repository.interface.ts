import { IBaseRepository } from '../../../shared/domain/base.repository';
import { UniversalProfile } from '@prisma/client';

export interface IProfileRepository extends IBaseRepository<UniversalProfile> {
  findByUserId(userId: string): Promise<UniversalProfile | null>;
}