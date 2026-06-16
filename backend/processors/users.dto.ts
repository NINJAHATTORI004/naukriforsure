import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string | null;

  constructor(user: User) {
    Object.assign(this, { id: user.id, email: user.email, name: user.name });
  }
}