import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../user.entity';

jest.mock('bcrypt');
const bcryptMock = bcrypt as any;

describe('AuthService', () => {
  let service: AuthService;
  let repository: any;
  let jwtService: any;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password_hash: 'hashedpassword',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    bcryptMock.compare.mockResolvedValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user successfully', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        'password',
        'hashedpassword',
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistent@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      bcryptMock.compare.mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        user: {
          id: 1,
          email: 'test@example.com',
          created_at: mockUser.created_at,
        },
        token: 'mock-jwt-token',
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockRedis = {
        get: jest
          .fn()
          .mockResolvedValue(
            JSON.stringify({ userId: 1, email: 'test@example.com' }),
          ),
      };
      service['redis'] = mockRedis as any;

      const result = await service.getCurrentUser('valid-token');

      expect(result).toEqual({
        success: true,
        user: {
          id: 1,
          email: 'test@example.com',
        },
      });
    });

    it('should throw UnauthorizedException if session not found', async () => {
      const mockRedis = {
        get: jest.fn().mockResolvedValue(null),
      };
      service['redis'] = mockRedis as any;

      await expect(service.getCurrentUser('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
