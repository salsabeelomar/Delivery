import { ProviderConstants } from 'src/common/constant/providers.constant';
import { Order } from './entities/order.entity';

export const OrderProvider = [
  {
    provide: ProviderConstants.ORDER,
    useValue: Order,
  },
];
