import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { IProfileRepository } from '../domain/profile.repository.interface';
import { UniversalProfile } from '@prisma/client';

@Injectable()
export class PrismaProfileRepository implements IProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UniversalProfile | null> {
    return this.prisma.universalProfile.findUnique({ where: { id, deletedAt: null } });
  }

  async findByUserId(userId: string): Promise<UniversalProfile | null> {
    return this.prisma.universalProfile.findUnique({ where: { userId, deletedAt: null } });
  }

  async findAll(): Promise<UniversalProfile[]> {
    return this.prisma.universalProfile.findMany({ where: { deletedAt: null } });
  }

  async save(entity: UniversalProfile): Promise<void> {
    await this.prisma.universalProfile.upsert({
      where: { id: entity.id },
      update: entity,
      create: entity,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.extendedClient.universalProfile.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.universalProfile.count({ where: { id, deletedAt: null } });
    return count > 0;
  }
}