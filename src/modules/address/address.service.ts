import { Inject, Injectable } from '@nestjs/common';
import { Address } from './entities/address.entity';
import { ProviderConstants } from 'src/common/constant/providers.constant';
import EventEmitter2 from 'eventemitter2';
import { AddressType } from './dto/address.dto';

@Injectable()
export class AddressService {
  constructor(
    @Inject(ProviderConstants.ADDRESS) private addressRepo: typeof Address,
  ) {}
  async addAddress(addressInfo: AddressType) {
    const newAdd = await this.addressRepo.create({
      ...addressInfo,
    });

    return newAdd;
  }
}
