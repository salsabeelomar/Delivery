import { ProviderConstants } from 'src/common/constant/providers.constant';
import { Address } from './entities/address.entity';

export const addressProvider = [
  {
    provide: ProviderConstants.ADDRESS,
    useValue: Address,
  },
];
