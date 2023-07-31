import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from 'src/modules/address/entities/address.entity';
import { User } from 'src/modules/auth/entities/user.entity';
import { Status } from 'src/common/types/enum/status';
@Table({
  tableName: 'orders',
  deletedAt: true,
  underscored: true,
})
export class Order extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  prefDescription: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.ENUM('Approved', 'Pending', 'Cancelled'),
    allowNull: false,
  })
  status: Status;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price: number;

  @ForeignKey(() => Address)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  addressId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  updatedBy: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  deletedBy: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Address)
  address: Address;
}
