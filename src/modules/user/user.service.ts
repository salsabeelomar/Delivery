import { Inject, Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { ProviderConstants } from 'src/common/constant/providers.constant';

@Injectable()
export class UserService {
  constructor(@Inject(ProviderConstants.AUTH) private userRepo: typeof User) {}

  async getUserById(id: number) {
    const user = await this.userRepo.findByPk(id, {
      attributes: ['id', 'email', 'role'],
    });
    return {
      email: user.getDataValue('email'),
      id: user.getDataValue('id'),
      role: user.getDataValue('role'),
    };
  }
}
