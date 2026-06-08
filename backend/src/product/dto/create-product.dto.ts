import { IsNumber, IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {}

export class AddProductDto {
  @IsString()
  categoryId: string;

  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Stock must be at least 0' })
  stock: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Price must be at least 0' })
  price: number;
}

// @IsOptional()
// @IsArray({ message: 'Images must be an array of strings' })
// @ArrayMinSize(1, { message: 'At least one image is required' })
// @ArrayMaxSize(10, { message: 'Maximum 10 images allowed' })
// @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
// images: string[];
