import { InjectModel } from '@nestjs/sequelize';
import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/modules/auth/entities/user.entity';

@Table({
  tableName: 'addresses',
  deletedAt: true,
})
export class Address extends Model {
  @InjectModel(() => User)
  static readonly userModel: typeof User;

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  pickup_lat: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  pickup_lng: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  dropoff_lat: number;
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  dropoff_lng: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  OrderOwner: number;
  
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  updatedBy: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  deletedBy: number;
  @BelongsTo(() => User)
  user: User;
}
