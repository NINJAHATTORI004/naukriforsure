import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { CurrentUser, ICurrentUser } from '../../../shared/decorators/current-user.decorator';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../application/queries/get-user-by-id.query';
import { UserDto } from './users.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user details' })
  async getMe(@CurrentUser() user: ICurrentUser): Promise<UserDto> {
    const foundUser = await this.queryBus.execute(new GetUserByIdQuery(user.id));
    return new UserDto(foundUser);
  }
}