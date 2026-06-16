import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { DbHealthIndicator } from './indicators/db.health';
import { RedisHealthIndicator } from './indicators/redis.health';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [TerminusModule, BullModule.registerQueue({ name: 'health-check-queue' })],
  controllers: [HealthController],
  providers: [DbHealthIndicator, RedisHealthIndicator],
})
export class HealthModule {}