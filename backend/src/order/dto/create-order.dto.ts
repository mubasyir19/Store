import { IsString, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  shippingName: string;

  @IsString()
  @IsPhoneNumber('ID')
  shippingPhone: string;

  @IsString()
  shippingAddress: string;

  @IsString()
  shippingCity: string;

  @IsString()
  shippingPostalCode: string;

  @IsOptional()
  @IsString()
  shippingNotes?: string;

  @IsEmail()
  email: string; // Midtrans customer details
}
