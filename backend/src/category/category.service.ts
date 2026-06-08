import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AddCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories() {
    try {
      return this.prisma.category.findMany({
        include: {
          products: true,
          _count: {
            select: { products: true },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  async getCategoryById(id: string) {
    try {
      return this.prisma.category.findFirst({
        where: {
          id: id,
        },
        include: {
          products: true,
          _count: {
            select: { products: true },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  async getCategoryBySlug(slug: string) {
    try {
      return this.prisma.category.findFirst({
        where: {
          slug: slug,
        },
        include: {
          products: true,
          _count: {
            select: { products: true },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  async addNewCategory(dto: AddCategoryDto) {
    if (!dto.name && !dto.slug) {
      throw new BadRequestException('Please fill out all field');
    }

    try {
      return this.prisma.category.create({
        data: {
          name: dto.name,
          slug: dto.slug,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    if (!id) {
      throw new BadRequestException('Id is required');
    }

    try {
      return this.prisma.category.update({
        where: {
          id: id,
        },
        data: {
          name: dto.name,
          slug: dto.slug,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  async deleteCategory(id: string) {
    if (id === null) {
      throw new BadRequestException('Id not found');
    }

    try {
      return this.prisma.category.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }
}
