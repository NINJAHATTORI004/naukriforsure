import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetProfileQuery } from './get-profile.query';
import { IProfileRepository } from '../../domain/profile.repository.interface';
import { PROFILE_REPOSITORY } from '../../../../shared/constants/tokens';
import { UniversalProfile } from '@prisma/client';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery, UniversalProfile> {
  constructor(@Inject(PROFILE_REPOSITORY) private readonly profileRepo: IProfileRepository) {}

  async execute(query: GetProfileQuery): Promise<UniversalProfile> {
    const profile = await this.profileRepo.findByUserId(query.userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}