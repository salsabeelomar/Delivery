import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { UserService } from 'src/modules/user/user.service';
import { authProvider } from 'src/modules/auth/auth.providers';
// import { OrderService } from 'src/modules/order/order.service';

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
  providers: [GatewayService, UserService, ...authProvider],
})
export class GatewayModule {}
