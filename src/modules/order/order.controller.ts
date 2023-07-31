import {
  Body,
  Controller,
  Post,
  Get,
  UseInterceptors,
  Put,
  Query,
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

@Controller('order')
@UseInterceptors(TransactionInter)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Roles(Role.client)
  @Post('')
  async createOrder(
    @Body() orderInfo: OrderType,
    @User() { id }: { id: number },
    @TransactionDec() transaction: Transaction,
  ) {
    return await this.orderService.addOrder(orderInfo, id, transaction);
  }

  @Roles(Role.client)
  @Put('')
  async updateOrder(
    @User() { id }: { id: number },
    @TransactionDec() transaction: Transaction,
    @Body('name') name: string,
    @Query('orderId') orderId: number,
  ) {
    return await this.orderService.updateOrder(name, id, orderId, transaction);
  }

  @Roles(Role.manager)
  @Get('')
  async showOrder(
    @User() { id }: { id: number },
    @TransactionDec() transaction: Transaction,
  ) {
    return await this.orderService.showOrder(id, transaction);
  }

  @Roles(Role.delivery)
  @Get(':id')
  async showOrderById(
    @Param() { id }: { id: number },
    @TransactionDec() transaction: Transaction,
  ) {
    return await this.orderService.showOrderById(id, transaction);
  }

  @Roles(Role.delivery)
  @Put('update')
  async updateStatus(
    @Query('orderId', new ParseIntPipe())
    orderId: number,
    @Query('status')
    status: Status,
    @TransactionDec() transaction: Transaction,
    @User() { id }: { id: number },
  ) {
    return await this.orderService.updateStatus(
      status,
      orderId,
      id,
      transaction,
    );
  }
}
