import { Injectable, UnauthorizedException, Inject, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../users/domain/user.repository.interface';
import { USER_REPOSITORY } from '../../../shared/constants/tokens';
import { RegisterDto, LoginDto } from '../presentation/auth.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists) {
      throw new BadRequestException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user: User = {
      id: uuidv4(),
      email: dto.email,
      emailVerified: null,
      passwordHash,
      name: dto.name,
      image: null,
      role: UserRole.CANDIDATE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    await this.userRepository.save(user);
    return this.generateTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  async refreshToken(userId: string, email: string, role: UserRole) {
    return this.generateTokens(userId, email, role);
  }

  async logout(userId: string): Promise<void> {
    // In a stateless JWT setup, true logout is handled client-side by deleting tokens.
    // If using a refresh token blacklist, implement that logic here.
    return Promise.resolve();
  }

  private async generateTokens(userId: string, email: string, role: UserRole) {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}