import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';
import { USER_REPOSITORY } from '../../shared/constants/tokens';
import { UsersController } from './presentation/users.controller';
import { UserService } from './application/user.service';
import { GetUserByIdHandler } from './application/queries/get-user-by-id.handler';

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    UserService,
    GetUserByIdHandler,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}