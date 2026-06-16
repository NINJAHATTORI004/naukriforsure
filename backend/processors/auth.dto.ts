import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'StrongP@ss123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongP@ss123' })
  @IsString()
  password!: string;
}