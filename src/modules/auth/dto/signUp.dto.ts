import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SignInType } from './signIn.dto';
// import { Role } from 'src/common/types/enum/roles';

export enum Role {
  manager = 'manager',
  client = 'client',
  delivery = 'delivery',
}

export class SignUpType extends SignInType {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(3)
  name: string;

  @IsEnum(Role)
  role: Role = Role.client;

  @IsNumber()
  @IsNotEmpty()
  phoneNumber: number;
}
