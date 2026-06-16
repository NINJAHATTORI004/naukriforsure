import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException } from '@nestjs/common';
import { CreateProfileCommand } from './create-profile.command';
import { IProfileRepository } from '../../domain/profile.repository.interface';
import { PROFILE_REPOSITORY } from '../../../../shared/constants/tokens';
import { v4 as uuidv4 } from 'uuid';
import { UniversalProfile } from '@prisma/client';

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler implements ICommandHandler<CreateProfileCommand, string> {
  constructor(@Inject(PROFILE_REPOSITORY) private readonly profileRepo: IProfileRepository) {}

  async execute(command: CreateProfileCommand): Promise<string> {
    const existingProfile = await this.profileRepo.findByUserId(command.userId);
    if (existingProfile) {
      throw new BadRequestException('User profile already exists.');
    }

    const id = uuidv4();
    const profile: UniversalProfile = {
      id,
      userId: command.userId,
      firstName: command.firstName,
      lastName: command.lastName,
      headline: command.headline,
      phone: null,
      location: null,
      summary: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      preferences: Prisma.JsonNull,
      workAuthorization: Prisma.JsonNull,
    } as unknown as UniversalProfile;

    await this.profileRepo.save(profile);
    return id;
  }
}