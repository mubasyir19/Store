import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AddCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleUser } from 'src/auth/dto/create-auth.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUser.Admin)
  addNew(@Body() createCategoryDto: AddCategoryDto) {
    return this.categoryService.addNewCategory(createCategoryDto);
  }

  @Get('all')
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Get('slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.categoryService.getCategoryBySlug(slug);
  }

  @Patch('edit/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUser.Admin)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUser.Admin)
  remove(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
