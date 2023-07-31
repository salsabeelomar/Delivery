import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
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

  address: Omit<AddressType, 'orderId'>;
}
