import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileController } from './presentation/profile.controller';
import { CreateProfileHandler } from './application/commands/create-profile.handler';
import { GetProfileHandler } from './application/queries/get-profile.handler';
import { PrismaProfileRepository } from './infrastructure/prisma-profile.repository';
import { PROFILE_REPOSITORY } from '../../shared/constants/tokens';

@Module({
  imports: [CqrsModule],
  controllers: [ProfileController],
  providers: [
    CreateProfileHandler,
    GetProfileHandler,
    {
      provide: PROFILE_REPOSITORY,
      useClass: PrismaProfileRepository,
    },
  ],
})
export class CandidateModule {}