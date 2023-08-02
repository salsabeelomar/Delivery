import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInType } from './dto/signIn.dto';
import { SignUpType } from './dto/signUp.dto';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signIn')
  async signIn(@Body('userInfo') userInfo: SignInType) {
    return this.authService.signIn(userInfo);
  }

  @Public()
  @Post('signup')
  async signup(@Body('userInfo') userInfo: SignUpType) {
    return this.authService.signup(userInfo);
  }
}
