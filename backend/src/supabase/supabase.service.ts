import { BadRequestException, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient() {
    return this.supabase;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'products',
  ): Promise<string> {
    // Validasi tipe file
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and WEBP are allowed',
      );
    }

    // Validasi ukuran file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const extension = file.originalname.split('.').pop();
    const fileName = `${folder}/${timestamp}-${randomString}.${extension}`;

    // Upload ke Supabase Storage
    const { data, error } = await this.supabase.storage
      .from('product-images')
      .upload(fileName, file.buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.mimetype,
      });

    if (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'products',
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // Extract file path from URL
    const urlParts = fileUrl.split('/');
    const filePath = urlParts
      .slice(urlParts.indexOf('product-images') + 1)
      .join('/');

    const { error } = await this.supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }
}
