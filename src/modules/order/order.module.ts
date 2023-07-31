import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderProvider } from './order.providers';
import { DatabaseModule } from '../database/database.module';
import { AddressService } from '../address/address.service';
import { addressProvider } from '../address/address.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    ...OrderProvider,
    ...addressProvider,
    AddressService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
