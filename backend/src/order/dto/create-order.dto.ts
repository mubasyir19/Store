import {
  IsString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsIn,
  IsNumber,
  Min,
} from 'class-validator';

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

  @IsString()
  @IsIn(['regular', 'express', 'same_day'])
  shippingMethod: string;

  @IsOptional()
  @IsString()
  shippingCourier?: string;

  @IsString()
  @IsIn(['bank_transfer', 'credit_card', 'gopay', 'qris'])
  paymentMethod: string;

  @IsOptional()
  @IsString()
  shippingService?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  shippingCost?: number;

  @IsEmail()
  email: string; // Midtrans customer details
}
