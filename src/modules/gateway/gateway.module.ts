import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { authProvider } from 'src/modules/auth/auth.providers';
import { OrderService } from '../order/order.service';
import { OrderProvider } from '../order/order.providers';
import { AddressService } from '../address/address.service';
import { addressProvider } from '../address/address.providers';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('secretKey'),
        signOptions: { expiresIn: '24h' },
      }),
      global: true,
    }),
  ],
  providers: [
    AddressService,
    GatewayService,
    UserService,
    ...addressProvider,
    ...authProvider,
  ],
})
export class GatewayModule {}
