import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class UploadService {
  constructor(private supabaseService: SupabaseService) {}

  async uploadProductImages(files: Express.Multer.File[]) {
    return this.supabaseService.uploadMultipleFiles(files, 'products');
  }

  async deleteImages(imageUrls: string[]) {
    for (const url of imageUrls) {
      await this.supabaseService.deleteFile(url);
    }
  }

  validateAndProcessImages(files?: Express.Multer.File[]) {
    if (!files || files.length === 0) return [];

    this.validateImageFiles(files);
    return this.uploadProductImages(files);
  }

  private validateImageFiles(files: Express.Multer.File[]) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    for (const file of files) {
      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type: ${file.mimetype}`);
      }
      if (file.size > maxSize) {
        throw new BadRequestException(`File too large: ${file.originalname}`);
      }
    }
  }
}
