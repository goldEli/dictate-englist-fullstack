import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as Redis from 'ioredis';
import { User } from '../user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private redis: Redis.default;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    this.redis = new Redis.default({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
    });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
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

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      token,
    };
  }

  async logout(token: string) {
    await this.redis.del(`session:${token}`);
    return { success: true };
  }

  async getCurrentUser(token: string) {
    try {
      const sessionData = await this.redis.get(`session:${token}`);

      if (!sessionData) {
        throw new UnauthorizedException('Invalid or expired session');
      }

      const session = JSON.parse(sessionData);
      return {
        success: true,
        user: {
          id: session.userId,
          email: session.email,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid session');
    }
  }
}
