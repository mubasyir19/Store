import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { AddProductDto } from './dto/create-product.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
    private uploadService: UploadService,
  ) {}

  async getAllProducts() {
    try {
      const products = await this.prisma.product.findMany({
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        code: 'SUCCESS',
        message: 'Products fetched successfully',
        data: products,
      };
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

  async getProductById(id: string) {
    try {
      return this.prisma.product.findFirst({
        where: {
          id: id,
        },
        include: {
          category: {
            select: {
              name: true,
            },
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

  async getProductBySlug(slug: string) {
    try {
      return this.prisma.product.findFirst({
        where: {
          slug: slug,
        },
        include: {
          category: {
            select: {
              name: true,
            },
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

  async addNewProduct(
    dto: AddProductDto,
    imageFiles: Express.Multer.File[] = [],
  ) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException({
          code: 'CATEGORY_NOT_FOUND',
          message: 'Category not found',
          data: null,
        });
      }

      // 2. Validasi slug uniqueness
      const existingProduct = await this.prisma.product.findFirst({
        where: { slug: dto.slug },
      });

      if (existingProduct) {
        throw new BadRequestException({
          code: 'SLUG_ALREADY_EXISTS',
          message: 'Product with this slug already exists',
          data: null,
        });
      }

      // 3. Upload images ke Supabase (if any)
      // let imageUrls: string[] = [];
      // if (imageFiles && imageFiles.length > 0) {
      //   imageUrls = await this.supabaseService.uploadMultipleFiles(
      //     imageFiles,
      //     'products',
      //   );
      // }
      const imageUrls =
        await this.uploadService.validateAndProcessImages(imageFiles);

      const product = await this.prisma.product.create({
        data: {
          categoryId: dto.categoryId,
          name: dto.name,
          slug: dto.slug,
          description: dto.description || '',
          price: dto.price,
          stock: dto.stock,
          images: imageUrls,
        },
        include: {
          category: true,
        },
      });

      return {
        code: 'SUCCESS',
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      console.log('error add product = ', error);
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

  async updateProduct(
    id: string,
    dto: Partial<AddProductDto>,
    newImages?: Express.Multer.File[],
  ) {
    try {
      // Check if product exists
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException({
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
          data: null,
        });
      }

      if (dto.slug && dto.slug !== existingProduct.slug) {
        const slugExists = await this.prisma.product.findFirst({
          where: {
            slug: dto.slug,
            id: { not: id }, // Exclude current product
          },
        });

        if (slugExists) {
          throw new BadRequestException({
            code: 'SLUG_ALREADY_EXISTS',
            message: 'Product with this slug already exists',
            data: null,
          });
        }
      }

      // Upload new images if provided
      let imageUrls = existingProduct.images;
      if (newImages && newImages.length > 0) {
        const newImageUrls = await this.supabaseService.uploadMultipleFiles(
          newImages,
          'products',
        );
        imageUrls = [...existingProduct.images, ...newImageUrls];
      }

      // Update product
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: {
          categoryId: dto.categoryId,
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          price: dto.price,
          stock: dto.stock,
          images: imageUrls,
        },
        include: {
          category: true,
        },
      });

      return {
        code: 'SUCCESS',
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  async updateProductWithReplaceImages(
    id: string,
    dto: Partial<AddProductDto>,
    newImages?: Express.Multer.File[],
    replaceImages: boolean = false, // flag untuk mengganti vs append
  ) {
    try {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException({
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
          data: null,
        });
      }

      // Slug validation
      if (dto.slug && dto.slug !== existingProduct.slug) {
        const slugExists = await this.prisma.product.findFirst({
          where: {
            slug: dto.slug,
            id: { not: id },
          },
        });

        if (slugExists) {
          throw new BadRequestException({
            code: 'SLUG_ALREADY_EXISTS',
            message: 'Product with this slug already exists',
            data: null,
          });
        }
      }

      // Handle image uploads
      let imageUrls = existingProduct.images;
      if (newImages && newImages.length > 0) {
        const newImageUrls =
          await this.uploadService.validateAndProcessImages(newImages);

        if (replaceImages) {
          // Delete old images from storage
          if (existingProduct.images.length > 0) {
            await this.uploadService.deleteImages(existingProduct.images);
          }
          // Replace with new images
          imageUrls = newImageUrls;
        } else {
          // Append new images
          imageUrls = [...existingProduct.images, ...newImageUrls];
        }
      }

      // Update product
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: {
          categoryId: dto.categoryId,
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          price: dto.price,
          stock: dto.stock,
          images: imageUrls,
        },
        include: {
          category: true,
        },
      });

      return {
        code: 'SUCCESS',
        message: replaceImages
          ? 'Product images replaced successfully'
          : 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Update product error:', error);
      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  async deleteImagesFromProduct(
    productId: string,
    imageUrlsToDelete: string[],
  ) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException({
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
          data: null,
        });
      }

      // Delete images from Supabase
      // for (const imageUrl of imageUrlsToDelete) {
      //   await this.supabaseService.deleteFile(imageUrl);
      // }
      await this.uploadService.deleteImages(imageUrlsToDelete);

      // Remove images from product's images array
      const remainingImages = product.images.filter(
        (img) => !imageUrlsToDelete.includes(img),
      );

      // Update product in database
      const updatedProduct = await this.prisma.product.update({
        where: { id: productId },
        data: { images: remainingImages },
      });

      return {
        code: 'SUCCESS',
        message: 'Images deleted successfully',
        data: updatedProduct,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  async deleteProduct(id: string) {
    try {
      // Check if product exists
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException({
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
          data: null,
        });
      }

      // Delete images from Supabase
      if (existingProduct.images && existingProduct.images.length > 0) {
        const deletePromises = existingProduct.images.map((imageUrl) =>
          this.supabaseService.deleteFile(imageUrl),
        );
        await Promise.all(deletePromises);
      }

      // Delete product from database
      await this.prisma.product.delete({
        where: { id },
      });

      return {
        code: 'SUCCESS',
        message: 'Product deleted successfully',
        data: null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  async addProductImages(productId: string, newImages: Express.Multer.File[]) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const uploadedUrls =
        await this.uploadService.validateAndProcessImages(newImages);
      const updatedImages = [...product.images, ...uploadedUrls];

      const updatedProduct = await this.prisma.product.update({
        where: { id: productId },
        data: { images: updatedImages },
      });

      return {
        code: 'SUCCESS',
        message: 'Images added successfully',
        data: updatedProduct,
      };
    } catch (error) {
      console.log('error add product image = ', error);
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

  async replaceProductImages(
    productId: string,
    newImages: Express.Multer.File[],
  ) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Delete old images
      if (product.images.length > 0) {
        await this.uploadService.deleteImages(product.images);
      }

      // Upload new images
      const uploadedUrls =
        await this.uploadService.validateAndProcessImages(newImages);

      const updatedProduct = await this.prisma.product.update({
        where: { id: productId },
        data: { images: uploadedUrls },
      });

      return {
        code: 'SUCCESS',
        message: 'Images replaced successfully',
        data: updatedProduct,
      };
    } catch (error) {
      console.log('error replace product image = ', error);
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
