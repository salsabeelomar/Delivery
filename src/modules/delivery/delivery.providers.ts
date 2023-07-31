import { ProviderConstants } from 'src/common/constant/providers.constant';
import { Delivery } from './entities/delivery.entity';

export const DeliveryProvider = [
  {
    provide: ProviderConstants.DELIVERY,
    useValue: Delivery,
  },
];
