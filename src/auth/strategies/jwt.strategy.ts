import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

function jwtFromAuthorizationHeader(req: Request): string | null {
  const raw = req.headers?.authorization;
  if (!raw || typeof raw !== 'string') return null;

  let rest = raw.trim();

  while (/^Bearer\s+/i.test(rest)) {
    rest = rest.replace(/^Bearer\s+/i, '').trim();
  }

  rest = rest.replace(/^["']+|["']+$/g, '').trim();
  rest = rest.replace(/\s+/g, '');

  return rest.length > 0 ? rest : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: jwtFromAuthorizationHeader,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}