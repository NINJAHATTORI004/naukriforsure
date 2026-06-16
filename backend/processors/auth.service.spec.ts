import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../application/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from '../../users/domain/user.repository.interface';
import { USER_REPOSITORY } from '../../../shared/constants/tokens';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@prisma/client';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: IUserRepository;

  const mockUser: User = {
    id: 'user-id',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    name: 'Test User',
    role: UserRole.CANDIDATE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    emailVerified: null,
    image: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_REPOSITORY,
          useValue: {
            findByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('test-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key) => key),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw BadRequestException if user exists', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
      await expect(service.register({ email: 'test@example.com', password: 'password', name: 'Test' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should register a new user and return tokens', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await service.register({ email: 'test@example.com', password: 'password', name: 'Test' });

      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken', 'test-token');
      expect(result).toHaveProperty('refreshToken', 'test-token');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      await expect(service.login({ email: 'test@example.com', password: 'password' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login({ email: 'test@example.com', password: 'wrong-password' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});