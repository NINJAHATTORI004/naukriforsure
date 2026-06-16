import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { CurrentUser, ICurrentUser } from '../../../shared/decorators/current-user.decorator';
import { CreateProfileDto } from './profile.dto';
import { CreateProfileCommand } from '../application/commands/create-profile.command';
import { GetProfileQuery } from '../application/queries/get-profile.query';

@ApiTags('Profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfileController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  @ApiOperation({ summary: 'Create Universal Profile' })
  async createProfile(@Body() dto: CreateProfileDto, @CurrentUser() user: ICurrentUser) {
    const command = new CreateProfileCommand(user.id, dto.firstName, dto.lastName, dto.headline);
    const profileId = await this.commandBus.execute(command);
    return { id: profileId };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: ICurrentUser) {
    const query = new GetProfileQuery(user.id);
    return this.queryBus.execute(query);
  }
}