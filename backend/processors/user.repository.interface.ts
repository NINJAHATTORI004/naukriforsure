import { IBaseRepository } from '../../../shared/domain/base.repository';
import { User } from '@prisma/client';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}