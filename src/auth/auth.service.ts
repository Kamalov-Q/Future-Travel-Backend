import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../admin/entities/admin.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const admin = await this.adminRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(admin);
    await this.updateRefreshToken(admin.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: `Bearer`,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    };
  }

  async refreshTokens(refreshToken: string) {
    let payload: any;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException(`Invalid or expired refresh token: ${error}`);
    }

    const admin = await this.adminRepository.findOne({
      where: {id: payload.sub}
    });

    if(!admin || !admin.hashedRefreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, admin.hashedRefreshToken);

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(admin);
    await this.updateRefreshToken(admin.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: 'Bearer',
    }

  }

  async logout(adminId: string) {
    await this.adminRepository.update(adminId, {
      hashedRefreshToken: null
    })
  }

  private async generateTokens(admin: Admin) {
    const payload = {
      sub: admin.id,
      email: admin.email,
      name: admin.name,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15min',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken, 
      refreshToken
    };

  }

  private async updateRefreshToken(adminId: string, refreshToken: string) {

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.adminRepository.update(adminId, {
      hashedRefreshToken,
    });
  }


}
