import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { UserService } from '../user.service';
import { User } from '@prisma/client';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery, User> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetUserByIdQuery): Promise<User> {
    return this.userService.findById(query.id);
  }
}