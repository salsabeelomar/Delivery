import { Injectable, Inject } from '@nestjs/common';
import { ProviderConstants } from 'src/common/constant/providers.constant';
import { Order } from './entities/order.entity';
import { AddressService } from '../address/address.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderType } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ProviderConstants.ORDER) private orderRepo: typeof Order,
    @Inject(AddressService) private addressService: AddressService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async addOrder(orderInfo: OrderType, user) {
    const address = await this.addressService.addAddress({
      ...orderInfo.address,
      OrderOwner: user.id,
    });

    const order = await this.orderRepo.create({
      ...orderInfo,
      status: 'Pending',
      addressId: address.id,
      clientId: user.id,
    });

    const payload = {
      order: {
        id: order.id,
        prefDescription: order.prefDescription,
        name: order.name,
        price: order.price,
      },
      address: {
        pickup_lat: address.pickup_lat,
        pickup_lng: address.pickup_lng,
        dropoff_lng: address.dropoff_lat,
        dropoff_lat: address.dropoff_lng,
      },
    };
    this.eventEmitter.emit('order.created', payload);

    return {
      message: 'Order Added Successfully',
      data: order,
    };
  }
}
