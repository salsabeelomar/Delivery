import { Injectable, Inject, BadRequestException } from '@nestjs/common';
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
import { DeliveryService } from '../delivery/delivery.service';
import { WinstonLogger } from 'src/common/logging/winston.logger';
import { UserType } from '../user/dto/user.dto';

@Injectable()
export class OrderService {
  private readonly logger = new WinstonLogger();
  constructor(
    @Inject(ProviderConstants.ORDER) private orderRepo: typeof Order,
    @Inject(AddressService) private addressService: AddressService,
    @Inject(DeliveryService) private deliveryService: DeliveryService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async addOrder(
    orderInfo: Omit<OrderType, 'status'>,
    userId: number,
    transaction: Transaction,
  ) {
    const order = await this.orderRepo.scope('times').create(
      {
        ...orderInfo,
        status: 'Pending',
        userId,
      },
      { transaction },
    );
    this.logger.log(`new order added  ${order}`);

    const address = await this.addressService.addAddress(
      {
        ...orderInfo.address,
        orderId: order.id,
      },
      transaction,
    );
    this.logger.log(`new Address added id=  ${address.id}`);
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

  async showOrder(transaction: Transaction) {
    const allOrder = await this.orderRepo.scope('times').findAll({
      include: [
        {
          model: User,
        },
      ],
      transaction,
    });
    this.logger.log(`Find All order from manager ', ${allOrder}`);
    return {
      data: {
        orders: allOrder,
      },
    };
  }
  async updateOrder(
    name: string,
    user: UserType,
    orderId: number,
    transaction: Transaction,
  ) {
    const updateOrder = await this.orderRepo.scope('times').update(
      {
        name,
        updateBy: user.id,
      },
      {
        where: { id: orderId, userId: user.id },
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
    user: UserType,
    transaction: Transaction,
  ) {
    const updateOrder = await this.orderRepo.scope('times').update(
      {
        status: status,
        updateBy: user.id,
      },
      {
        where: { id: orderId },
        transaction,
      },
    );
    if (status === 'Approved') {
      await this.deliveryService.createDelivery(user.id, orderId, transaction);
    }

    CheckExisting(
      updateOrder[0],
      BadRequestException,
      'Failed to update status',
    );

    this.eventEmitter.emit(ORDER_EVENTS.UPDATE_STATUS, {
      status,
      clientId: user.id,
    });

    return {
      message: `Status Updated to ${status} Successfully`,
    };
  }

  async showOrderById(orderId: number, transaction: Transaction) {
    const order = await this.orderRepo.scope('times').findByPk(orderId, {
      include: [{ model: User }],
      transaction,
    });
    this.logger.log(`Get Order By Id ${order}`);

    return {
      data: order,
    };
  }
  async deleteOrder(id: number, user: UserType, transaction: Transaction) {
    const deletedOrder = await this.orderRepo.update(
      {
        deleteBy: id,
        deletedAt: new Date(),
      },
      {
        where: {
          id,
          userId: user.id,
        },
        transaction,
      },
    );

    CheckExisting(deletedOrder[0], BadRequestException, 'Order not found');

    this.logger.log(`Delete Order By user = ${user.id}`);

    return {
      message: 'Order deleted  successfully',
    };
  }
}
