import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { ProviderConstants } from 'src/common/constant/providers.constant';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class UserService {
  constructor(
    @Inject(ProviderConstants.AUTH) private userRepo: typeof User,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async getUserById(id: number) {
    const user = await this.userRepo.findByPk(id, {
      attributes: ['id', 'email', 'role'],
    });
    const userData = {
      email: user.getDataValue('email'),
      id: user.getDataValue('id'),
      role: user.getDataValue('role'),
    };

    this.logger.log(`The user Id  = ${userData.id}`);

    return { ...userData };
  }
}
