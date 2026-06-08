import { PartialType } from '@nestjs/mapped-types';
import { AddCategoryDto } from 'src/category/dto/create-category.dto';
// import { CreateAuthDto } from './create-auth.dto';

// export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
export class UpdateAuthDto extends PartialType(AddCategoryDto) {}
