import { Injectable, Inject } from '@nestjs/common';
import { Delivery } from './entities/delivery.entity';
import { ProviderConstants } from 'src/common/constant/providers.constant';
import { Transaction } from 'sequelize';
import { WinstonLogger } from 'src/common/logging/winston.logger';

@Injectable()
export class DeliveryService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(ProviderConstants.DELIVERY) private deliveryRepo: typeof Delivery,
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
