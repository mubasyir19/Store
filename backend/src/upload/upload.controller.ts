import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('product-images')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async uploadProductImages(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.uploadService.uploadProductImages(files?.images || []);
  }

  @Delete('images')
  async deleteImages(@Body() body: { urls: string[] }) {
    return this.uploadService.deleteImages(body.urls);
  }
}
