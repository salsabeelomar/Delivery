import {
  Injectable,
  Logger,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { ProviderConstants } from 'src/common/constant/providers.constant';
import { Order } from './entities/order.entity';
import { AddressService } from '../address/address.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderType } from './dto/order.dto';
import { Transaction } from 'sequelize';
import { Address } from '../address/entities/address.entity';
import { User } from '../auth/entities/user.entity';
import { CheckExisting } from 'src/common/utils/checkExisting';
import { ORDER_EVENTS } from 'src/common/events';
import { Status } from 'src/common/types/enum/status';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DeliveryService } from '../delivery/delivery.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ProviderConstants.ORDER) private orderRepo: typeof Order,
    @Inject(AddressService) private addressService: AddressService,
    @Inject(DeliveryService) private deliveryService: DeliveryService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async addOrder(
    orderInfo: OrderType,
    userId: number,
    transaction: Transaction,
  ) {
    const order = await this.orderRepo.create(
      {
        ...orderInfo,
        status: 'Pending',
        userId,
      },
      { transaction },
    );
    this.logger.log('new order added ', order);

    const address = await this.addressService.addAddress(
      {
        ...orderInfo.address,
        orderId: order.id,
      },
      transaction,
    );
    this.logger.log('new Address added ', address);
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

  async showOrder(user: number, transaction: Transaction) {
    const excluded = [
      'createdAt',
      'updatedAt',
      'updatedBy',
      'deletedAt',
      'deletedBy',
    ];
    const allOrder = await this.orderRepo.findAll({
      include: [
        {
          model: Address,
          attributes: {
            exclude: excluded,
          },
        },
        {
          model: User,
          attributes: {
            exclude: excluded,
          },
        },
      ],
      transaction,
    });
    this.logger.log('Find All order from manager ', allOrder);
    return {
      data: {
        orders: allOrder,
      },
    };
  }
  async updateOrder(
    name: string,
    userId: number,
    orderId: number,
    transaction: Transaction,
  ) {
    const updateOrder = await this.orderRepo.update(
      {
        name,
        updateBy: userId,
      },
      {
        where: { id: orderId, userId },
        transaction,
      },
    );
    CheckExisting(updateOrder[0], BadRequestException, 'Failed to update name');
    this.logger.log('Update Successfully Order Info');

    return {
      message: 'Ordered Updated Successfully',
    };
  }
  async updateStatus(
    status: Status,
    orderId: number,
    userId: number,
    transaction: Transaction,
  ) {
    const updateOrder = await this.orderRepo.update(
      {
        status: status,
        updateBy: userId,
      },
      {
        where: { id: orderId },
        transaction,
      },
    );
    if (status === 'Approved') {
      await this.deliveryService.createDelivery(userId, orderId, transaction);
    }
    CheckExisting(
      updateOrder[0],
      BadRequestException,
      'Failed to update status',
    );

    this.eventEmitter.emit(ORDER_EVENTS.UPDATE_STATUS, {
      status,
      clientId: userId,
    });

    return {
      message: `Status Updated to ${status} Successfully`,
    };
  }

  async showOrderById(orderId: number, transaction: Transaction) {
    const order = await this.orderRepo.findByPk(orderId, {
      include: [{ model: User }, { model: Address }],
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'updatedBy',
          'deletedAt',
          'deletedBy',
        ],
      },
      transaction,
    });
    this.logger.log('Get Order By Id', order);

    return {
      data: order,
    };
  }
}
