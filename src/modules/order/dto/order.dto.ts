import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Status } from 'src/common/types/enum/status';
import { AddressType } from 'src/modules/address/dto/address.dto';

export class OrderType {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  prefDescription: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  id: number;

  status: Status;

  address: Omit<AddressType, 'orderId'>;
}
