import { Type } from 'class-transformer';
import { IsInt, IsString, IsUUID, Max, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsUUID('4', { message: 'Product ID must be a valid UUID' })
  productId: string;

  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(99, { message: 'Maximum quantity is 99' })
  @Type(() => Number)
  quantity: string;
}

export class UpdateCartQuantityDto {
  @IsInt()
  @Min(0, { message: 'Quantity cannot be negative' })
  @Max(99, { message: 'Maximum quantity is 99' })
  @Type(() => Number)
  quantity: number;
}
