import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Admin login',
    description: 'Authenticate as admin and receive a JWT access token',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        tokenType: 'Bearer',
        admin: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'abdujabborsharobiddinov5@gmail.com',
          name: 'Super Admin',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh tokens',
    description: 'Generate a new access token using refresh token'
  })
  @ApiBody({type: RefreshTokenDto})
  @ApiResponse({
    status: 200, 
    description: 'Tokens refreshed successfully',
    schema: {
      example: {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        tokenType: 'Bearer'
      },
    },
  })
  @ApiResponse({status: 401, description: 'Invalid or expired refresh token'})
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout admin',
    description: 'XClear stored refresh token for current admin',
  })
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.id);
  }
}
