import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { IUserRepository } from '../domain/user.repository.interface';
import { User } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id, deletedAt: null } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email, deletedAt: null } });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ where: { deletedAt: null } });
  }

  async save(entity: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: entity.id },
      update: entity,
      create: entity,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.extendedClient.user.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { id, deletedAt: null } });
    return count > 0;
  }
}