import {
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { SignInType, SignUpType, payloadToken } from './dto';
import { ProviderConstants } from 'src/common/constant/providers.constant';
import { CheckExisting } from 'src/common/utils/checkExisting';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ProviderConstants.AUTH) private authRepo: typeof User,
    private readonly jwt: JwtService,
  ) {}

  async getEmail(email: string): Promise<User> {
    return await this.authRepo.findOne({
      attributes: ['id', 'email'],
      where: { email: email },
    });
  }
  generateToken(user: payloadToken): string {
    const payload = {
      sub: user.id,
      user: { name: user.name, email: user.email, role: user.role },
    };
    return this.jwt.sign(payload);
  }

  async signIn(userInfo: SignInType) {
    const getEmail = await this.getEmail(userInfo.email);
    CheckExisting(getEmail, BadRequestException, 'Email not Exist');

    const getPass = await this.authRepo.findByPk(getEmail.id, {
      attributes: ['id', 'email', 'password', 'name', 'role'],
    });
    const match =
      getPass && (await bcrypt.compare(userInfo.password, getPass.password));

    CheckExisting(match, UnauthorizedException, 'Password not correct');

    const user: payloadToken = {
      id: getPass.id,
      email: getPass.email,
      name: getPass.name,
      role: getPass.role,
    };
    return { user, token: this.generateToken(user) };
  }

  async signup(userInfo: SignUpType) {
    const getEmail = await this.getEmail(userInfo.email);
    CheckExisting(!getEmail, BadRequestException, 'Email is Exists');

    const hashedPass = bcrypt.hashSync(userInfo.password, 10);

    const newUser = await this.authRepo.create<User>({
      ...userInfo,
      password: hashedPass,
    });

    const user: payloadToken = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };
    return { user, token: this.generateToken(user) };
  }
}
