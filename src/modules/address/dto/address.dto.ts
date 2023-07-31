import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class AddressType {
  @IsNumber()
  @IsNotEmpty()
  @Min(-90, { message: 'Latitude must be greater than or equal to -90' })
  @Max(90, { message: 'Latitude must be less than or equal to 90' })
  pickup_lat: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(-180, { message: 'Longitude must be greater than or equal to -180' })
  @Max(180, { message: 'Longitude must be less than or equal to 180' })
  pickup_lng: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(-180, { message: 'Longitude must be greater than or equal to -180' })
  @Max(180, { message: 'Longitude must be less than or equal to 180' })
  dropoff_lng: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(-90, { message: 'Latitude must be greater than or equal to -90' })
  @Max(90, { message: 'Latitude must be less than or equal to 90' })
  dropoff_lat: number;

  @IsNumber()
  @IsNotEmpty()
  orderId: number;
}
