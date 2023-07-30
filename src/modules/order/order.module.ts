import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderProvider } from './order.providers';
import { authProvider } from '../auth/auth.providers';
import { DatabaseModule } from '../database/database.module';
import { AddressService } from '../address/address.service';
import { addressProvider } from '../address/address.providers';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    ...OrderProvider,
    // ...authProvider,

    ...addressProvider,
    AddressService,
  ],
  // exports: [OrderService],
})
export class OrderModule {}
