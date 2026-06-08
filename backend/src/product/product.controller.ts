import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AddProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  async findAll() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.getProductById(id);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productService.getProductBySlug(slug);
  }

  @Post('add')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async createProduct(
    @Body() addProductDto: AddProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    // Convert string to number if needed (FormData sends everything as string)
    const processedDto = {
      ...addProductDto,
      price:
        typeof addProductDto.price === 'string'
          ? parseFloat(addProductDto.price)
          : addProductDto.price,
      stock:
        typeof addProductDto.stock === 'string'
          ? parseInt(addProductDto.stock)
          : addProductDto.stock,
    };

    return this.productService.addNewProduct(processedDto, files?.images || []);
  }

  @Post(':id/images')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async addProductImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.productService.addProductImages(id, files?.images || []);
  }

  @Put(':id/images')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async replaceProductImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.productService.replaceProductImages(id, files?.images || []);
  }

  // @Put('edit/:id')
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  // async updateProduct(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateProductDto: Partial<AddProductDto>,
  //   @UploadedFiles() files: { images?: Express.Multer.File[] },
  // ) {
  //   // Convert string to number if needed
  //   const processedDto = {
  //     ...updateProductDto,
  //     price:
  //       updateProductDto.price && typeof updateProductDto.price === 'string'
  //         ? parseFloat(updateProductDto.price)
  //         : updateProductDto.price,
  //     stock:
  //       updateProductDto.stock && typeof updateProductDto.stock === 'string'
  //         ? parseInt(updateProductDto.stock)
  //         : updateProductDto.stock,
  //   };

  //   return this.productService.updateProduct(id, processedDto, files?.images);
  // }

  @Put('edit/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: Partial<AddProductDto>,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Query('replaceImages') replaceImages?: string, // query param: ?replaceImages=true
  ) {
    // Convert string to number if needed
    const processedDto = {
      ...updateProductDto,
      price:
        updateProductDto.price && typeof updateProductDto.price === 'string'
          ? parseFloat(updateProductDto.price)
          : updateProductDto.price,
      stock:
        updateProductDto.stock && typeof updateProductDto.stock === 'string'
          ? parseInt(updateProductDto.stock)
          : updateProductDto.stock,
    };

    // Jika ingin support replace images
    const shouldReplaceImages = replaceImages === 'true';

    if (shouldReplaceImages) {
      return this.productService.updateProductWithReplaceImages(
        id,
        processedDto,
        files?.images,
        true,
      );
    }

    return this.productService.updateProduct(id, processedDto, files?.images);
  }

  @Delete(':id/images')
  async deleteProductImages(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { imageUrls: string[] },
  ) {
    return this.productService.deleteImagesFromProduct(id, body.imageUrls);
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.deleteProduct(id);
  }
}
