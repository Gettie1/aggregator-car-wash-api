import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UnauthorizedException,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreateAuthDto } from './dto/login.dto';
import { RtGuard } from './guards/rt.guard';

// Define RequestWithUser interface if not already defined elsewhere
interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    refreshToken: string;
    // add other user properties if needed
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('signin')
  signIn(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signIn(createAuthDto);
  }
  @UseGuards(RtGuard)
  @Get('signout/:id')
  signOut(@Param('id') id: string) {
    return this.authService.signOut(id);
  }
  @Public()
  @UseGuards(RtGuard)
  @Get('refresh')
  refreshTokens(@Query('id') id: string, @Req() req: RequestWithUser) {
    const user = req.user;
    if (user.sub !== id) {
      throw new UnauthorizedException('Invalid user ID');
    }
    return this.authService.refreshTokens(Number(id), user.refreshToken);
  }
}
