import { Module } from '@nestjs/common';

import { DeliveryService } from './delivery.service';
import { DatabaseModule } from '../database/database.module';
import { DeliveryProvider } from './delivery.providers';

@Module({
  imports: [DatabaseModule],
  providers: [DeliveryService, ...DeliveryProvider],
})
export class DeliveryModule {}
