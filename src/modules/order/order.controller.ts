import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Roles } from 'src/common/decorator/role.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { OrderType } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Roles('client')
  @Post('')
  async createOrder(@Body() orderInfo: OrderType, @User() user) {
    return await this.orderService.addOrder(orderInfo, user);
  }
}
