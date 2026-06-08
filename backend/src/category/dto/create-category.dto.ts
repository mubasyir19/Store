import { IsString, MinLength } from 'class-validator';

export class AddCategoryDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsString()
  slug: string;
}
