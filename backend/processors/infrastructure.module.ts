import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BullMqModule } from './bullmq/bullmq.module';
import { OpenSearchModule } from './opensearch/opensearch.module';
import { HealthModule } from './health/health.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [PrismaModule, BullMqModule, OpenSearchModule, HealthModule, S3Module],
  exports: [PrismaModule, BullMqModule, OpenSearchModule, HealthModule, S3Module],
})
export class InfrastructureModule {}