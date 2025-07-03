import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

type JWTPayload = {
  sub: number;
  email: string;
};
interface JwtPayloadWithRefreshToken extends JWTPayload {
  refreshToken: string;
}
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'Jwt-rt') {
  constructor(private readonly configService: ConfigService) {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    };
    super(options);
  }

  validate(req: Request, payload: JWTPayload): JwtPayloadWithRefreshToken {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const refreshToken: string = authHeader.replace('Bearer', '').trim();
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    return {
      ...payload,
      refreshToken,
    };
  }
}
