import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ResumeController } from './presentation/resume.controller';
import { S3Module } from '../../infrastructure/s3/s3.module';

@Module({
  imports: [
    S3Module,
    BullModule.registerQueue({ name: 'resume-parsing' }),
  ],
  controllers: [ResumeController],
})
export class ResumeModule {}