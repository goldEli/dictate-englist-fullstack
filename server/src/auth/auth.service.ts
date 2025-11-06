import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as Redis from 'ioredis';
import { User } from '../user.entity';
import { LoginDto } from './dto/login.dto';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class AuthService {
  private redis: Redis.default;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly logger: AppLogger,
  ) {
    this.redis = new Redis.default({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
    });
    this.logger.setContext('AuthService');
  }

  async validateUser(email: string, password: string): Promise<User> {
    this.logger.debug(`Validating user: ${email}`, 'validateUser');

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(`Login failed - user not found: ${email}`, 'validateUser');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed - invalid password: ${email}`, 'validateUser');
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug(`User validated successfully: ${email}`, 'validateUser');
    return user;
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);

      const payload = {
        sub: user.id,
        email: user.email,
      };

      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '24h',
      });

      await this.redis.setex(`session:${token}`, 86400, JSON.stringify({
        userId: user.id,
        email: user.email,
      }));

      this.logger.log(`User login successful: userId=${user.id}, email=${user.email}`, 'login');

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        token,
      };
    } catch (error) {
      this.logger.error(`Login failed: ${loginDto.email}`, error.stack, 'login');
      throw error;
    }
  }

  async logout(token: string) {
    try {
      await this.redis.del(`session:${token}`);
      this.logger.log(`User logout successful`, 'logout');
      return { success: true };
    } catch (error) {
      this.logger.error('Logout failed', error.stack, 'logout');
      throw error;
    }
  }

  async getCurrentUser(token: string) {
    try {
      const sessionData = await this.redis.get(`session:${token}`);

      if (!sessionData) {
        this.logger.warn('Session validation failed - invalid or expired session', 'getCurrentUser');
        throw new UnauthorizedException('Invalid or expired session');
      }

      const session = JSON.parse(sessionData);
      this.logger.log(`Session validation successful: userId=${session.userId}`, 'getCurrentUser');

      return {
        success: true,
        user: {
          id: session.userId,
          email: session.email,
        },
      };
    } catch (error) {
      this.logger.error('Session validation failed', error.stack, 'getCurrentUser');
      throw new UnauthorizedException('Invalid session');
    }
  }
}
