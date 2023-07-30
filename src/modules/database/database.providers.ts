import { Sequelize } from 'sequelize-typescript';
import { DATABASE_CONSTANT } from 'src/common/constant';
import { ConfigService } from '@nestjs/config';
import { Order } from '../order/entities/order.entity';
import { User } from '../auth/entities/user.entity';
import { Delivery } from '../delivery/entities/delivery.entity';
import { Address } from '../address/entities/address.entity';

export const DatabaseProvider = [
  {
    provide: DATABASE_CONSTANT.DATABASE_PROVIDE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        ...configService.get('database'),
        define: {
          underscored: true,
          paranoid: true,
        },
      });
      sequelize.addModels([User, Order, Delivery, Address]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
