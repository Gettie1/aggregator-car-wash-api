import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RtGuard extends AuthGuard('Jwt-rt') {
  constructor() {
    super();
  }
}
