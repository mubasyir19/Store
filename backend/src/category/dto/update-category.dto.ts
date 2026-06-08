import { PartialType } from '@nestjs/mapped-types';
import { AddCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(AddCategoryDto) {}
