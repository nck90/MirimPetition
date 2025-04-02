import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { CacheService } from '../cache/cache.service';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly userService: UserService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    return this.userService.create(registerDto);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt.secret'),
      });

      const decoded = this.jwtService.decode(token) as { sub: string; email: string };
      const user = await this.userService.findOne(decoded.sub);

      const payload = { email: user.email, sub: user.id };
      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.cacheService.del(`refresh_token_${userId}`);
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password' | 'hashPassword' | 'comparePassword'> | null> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, hashPassword, comparePassword, ...result } = user;
      return result;
    }
    return null;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    await this.userService.updatePassword(userId, newPassword);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.configService.get<string>('jwt.resetSecret'),
      });

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      await this.userService.updatePassword(user.id, newPassword);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }

  async verifyResetToken(token: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const cachedToken = await this.cacheService.get(`reset_token_${payload.sub}`);
      return cachedToken === token;
    } catch {
      return false;
    }
  }

  async setNewPassword(token: string, newPassword: string): Promise<void> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const cachedToken = await this.cacheService.get(`reset_token_${user.id}`);
    if (!cachedToken || cachedToken !== token) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    await this.userService.updatePassword(user.id, newPassword);
    await this.cacheService.del(`reset_token_${user.id}`);
  }
}