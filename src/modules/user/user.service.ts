import { Inject, Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { ProviderConstants } from 'src/common/constant/providers.constant';
import { WinstonLogger } from 'src/common/logging/winston.logger';
import { UserType } from './dto/user.dto';
@Injectable()
export class UserService {
  private readonly logger = new WinstonLogger();
  constructor(@Inject(ProviderConstants.AUTH) private userRepo: typeof User) {}

  async getUserById(id: number) {
    const user = await this.userRepo.findByPk(id, {
      attributes: ['id', 'email', 'role'],
    });
    const userData: UserType = {
      email: user.getDataValue('email'),
      id: user.getDataValue('id'),
      role: user.getDataValue('role'),
    };

    this.logger.log(`The user Id  = ${userData.id}`);

    return { ...userData };
  }
}
