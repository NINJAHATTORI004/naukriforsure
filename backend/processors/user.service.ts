import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../domain/user.repository.interface';
import { USER_REPOSITORY } from '../../../shared/constants/tokens';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}