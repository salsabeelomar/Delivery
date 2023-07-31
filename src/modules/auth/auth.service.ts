import {
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { SignInType, SignUpType, payloadToken } from './dto';
import { ProviderConstants } from 'src/common/constant/providers.constant';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ProviderConstants.AUTH) private authRepo: typeof User,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly jwt: JwtService,
  ) {}

  async getEmail(email: string): Promise<User> {
    const getEmail = await this.authRepo.findOne({
      attributes: ['id', 'email'],
      where: { email: email },
    });
    this.logger.debug('Find Email');
    return getEmail;
  }
  generateToken(user: payloadToken): string {
    const payload = {
      sub: user.id,
      user: { name: user.name, email: user.email, role: user.role },
    };
    const token = this.jwt.sign(payload);
    this.logger.debug('Sign Token ');

    return token;
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

    this.logger.log(`User Signed with id ${getPass.id} `);
    const user: payloadToken = {
      id: getPass.id,
      email: getPass.email,
      name: getPass.name,
      role: getPass.role,
    };
    return {
      message: 'Signed  Successfully',
      data: { user, token: this.generateToken(user) },
    };
  }

  async signup(userInfo: SignUpType) {
    const getEmail = await this.getEmail(userInfo.email);
    CheckExisting(!getEmail, BadRequestException, 'Email is Exists');

    const hashedPass = bcrypt.hashSync(userInfo.password, 10);

    const newUser = await this.authRepo.create<User>({
      ...userInfo,
      password: hashedPass,
    });

    this.logger.log(`User Signup with id ${newUser.id} `);

    const user: payloadToken = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };
    return {
      message: 'Signed Up Successfully',
      data: { user, token: this.generateToken(user) },
    };
  }
}
