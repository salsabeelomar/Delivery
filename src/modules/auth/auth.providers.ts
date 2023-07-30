import { ProviderConstants } from 'src/common/constant/providers.constant';
import { User } from './entities/user.entity';

export const authProvider = [
  {
    provide: ProviderConstants.AUTH,
    useValue: User,
  },
];
