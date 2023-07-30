import { Module } from '@nestjs/common';
import { addressProvider } from './address.providers';
import { AddressService } from './address.service';
import { authProvider } from '../auth/auth.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...addressProvider, AddressService, ...authProvider],
  exports: [AddressService],
})
export class AddressModule {}
