import {
  Body,
  Controller,
  Post,
  Get,
  UseInterceptors,
  Put,
  Query,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { User } from 'src/common/decorator/user.decorator';
import { OrderType } from './dto/order.dto';
import { Role } from 'src/common/types/enum/roles';
import { Roles } from 'src/common/decorator/role.decorator';
import { TransactionInter } from 'src/common/interceptor/transaction.interceptor';
import { TransactionDec } from 'src/common/decorator/transaction.decorator';
import { Transaction } from 'sequelize';
import { Status } from 'src/common/types/enum/status';
import { UserType } from '../user/dto/user.dto';

@Controller('order')
@UseInterceptors(TransactionInter)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Roles(Role.client)
  @Post()
  async createOrder(
    @Body() orderInfo: Omit<OrderType, 'status'>,
    @User() user: UserType,
    @TransactionDec() transaction: Transaction,
  ) {
    return this.orderService.addOrder(orderInfo, user.id, transaction);
  }

  @Roles(Role.client)
  @Put()
  async updateOrder(
    @User() user: UserType,
    @TransactionDec() transaction: Transaction,
    @Body() name: Partial<OrderType>,
    @Query() order: Partial<OrderType>,
  ) {
    return this.orderService.updateOrder(
      name.name,
      user,
      order.id,
      transaction,
    );
  }

  @Roles(Role.client)
  @Delete()
  async deleteOrder(
    @User() user: UserType,
    @TransactionDec() transaction: Transaction,
    @Query() orderId: Partial<OrderType>,
  ) {
    return this.orderService.deleteOrder(orderId.id, user, transaction);
  }

  @Roles(Role.manager)
  @Get()
  async showOrder(@TransactionDec() transaction: Transaction) {
  
    return this.orderService.showOrder(transaction);
  }

  @Roles(Role.delivery)
  @Get(':id')
  async showOrderById(
    @Param() orderId: Partial<OrderType>,
    @TransactionDec() transaction: Transaction,
  ) {
    return this.orderService.showOrderById(orderId.id, transaction);
  }

  @Roles(Role.delivery)
  @Put('update')
  async updateStatus(
    @Query() order: Partial<OrderType>,
    @TransactionDec() transaction: Transaction,
    @User() user: UserType,
  ) {
    return this.orderService.updateStatus(
      order.status,
      order.id,
      user,
      transaction,
    );
  }
}
