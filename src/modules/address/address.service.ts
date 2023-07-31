import { Inject, Injectable, Logger } from '@nestjs/common';
import { Address } from './entities/address.entity';
import { ProviderConstants } from 'src/common/constant/providers.constant';

import { AddressType } from './dto/address.dto';
import { Transaction } from 'sequelize';
import { Order } from '../order/entities/order.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class AddressService {
  constructor(
    @Inject(ProviderConstants.ADDRESS) private addressRepo: typeof Address,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}
  async addAddress(addressInfo: AddressType, transaction: Transaction) {
    const newAdd = await this.addressRepo.create(
      {
        ...addressInfo,
      },
      { transaction: transaction },
    );
    this.logger.log(`address Added with Id=${newAdd.id}`);
    return newAdd;
  }
  async getAddress(orderId: number) {
    const address = await this.addressRepo.findOne({
      attributes: ['pickup_lat', 'pickup_lng', 'dropoff_lat', 'dropoff_lng'],
      where: { orderId },
      include: {
        model: Order,
        attributes: ['userId'],
      },
    });

    const time = this.calculateDistance({
      dropoff_lat: address.dropoff_lat,
      pickup_lat: address.pickup_lat,
      dropoff_lng: address.dropoff_lng,
      pickup_lng: address.pickup_lng,
    });
    return { time, userId: address.order.userId };
  }

  calculateDistance(address: Omit<AddressType, 'orderId'>) {
    const newAddress = this.addressMathPI([
      address.dropoff_lat,
      address.pickup_lat,
      address.dropoff_lng,
      address.pickup_lng,
    ]);
    let disLong = newAddress[2] - newAddress[3];
    let dislat = newAddress[0] - newAddress[1];
    let a =
      Math.pow(Math.sin(dislat / 2), 2) +
      Math.cos(newAddress[1]) *
        Math.cos(newAddress[0]) *
        Math.pow(Math.sin(disLong / 2), 2);

    const Kilometer = 6371;
    const time = 2 * Math.asin(Math.sqrt(a)) * Kilometer;
    this.logger.log(`Time for Certain Distance with Id=${time}`);

    return time;
  }

  addressMathPI(address: number[]) {
    return address.map((ele) => (ele * Math.PI) / 180);
  }
}
