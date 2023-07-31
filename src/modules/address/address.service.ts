import { Inject, Injectable } from '@nestjs/common';
import { Address } from './entities/address.entity';
import { ProviderConstants } from 'src/common/constant/providers.constant';

import { AddressType } from './dto/address.dto';
import { Transaction } from 'sequelize';

@Injectable()
export class AddressService {
  constructor(
    @Inject(ProviderConstants.ADDRESS) private addressRepo: typeof Address,
  ) {}
  async addAddress(addressInfo: AddressType, transaction: Transaction) {
    const newAdd = await this.addressRepo.create(
      {
        ...addressInfo,
      },
      { transaction: transaction },
    );

    return newAdd;
  }
  async calculateDistance(addressId: number) {
    const address = await this.addressRepo.findByPk(addressId, {
      attributes: ['pickup_lat', 'pickup_lng', 'dropoff_lat', 'dropoff_lng'],
    });
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
    return 2 * Math.asin(Math.sqrt(a)) * Kilometer;
  }

  addressMathPI(address: number[]) {
    return address.map((ele) => (ele * Math.PI) / 180);
  }
}
