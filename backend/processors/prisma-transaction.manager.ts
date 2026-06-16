import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ITransactionManager } from '../../shared/domain/transaction.manager';

@Injectable()
export class PrismaTransactionManager implements ITransactionManager {
  constructor(private readonly prisma: PrismaService) {}

  async execute<T>(operation: (txClient: any) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(operation);
  }
}