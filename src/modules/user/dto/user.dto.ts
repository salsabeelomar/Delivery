import {
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/common/types/enum/roles';

export class UserType {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
