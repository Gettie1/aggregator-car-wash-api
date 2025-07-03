import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export type JWTPayload = {
  sub: number;
  email: string;
  role: string;
};
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'Jwt-at') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  validate(payload: JWTPayload): JWTPayload {
    return payload;
  }
}
