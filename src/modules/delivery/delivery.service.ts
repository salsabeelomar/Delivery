import { Injectable, Inject, Logger } from '@nestjs/common';
import { Delivery } from './entities/delivery.entity';
import { ProviderConstants } from 'src/common/constant/providers.constant';
import { Transaction } from 'sequelize';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class DeliveryService {
  constructor(
    @Inject(ProviderConstants.DELIVERY) private deliveryRepo: typeof Delivery,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async createDelivery(
    userId: number,
    orderId: number,
    transaction: Transaction,
  ) {
    const addDelivery = await this.deliveryRepo.create(
      { userId, orderId },
      { transaction },
    );
    this.logger.log('Delivery added Successfully ');
    return addDelivery;
  }
}
