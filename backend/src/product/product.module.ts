import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { UploadService } from 'src/upload/upload.service';

@Module({
  imports: [SupabaseModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService, UploadService],
  exports: [ProductService],
})
export class ProductModule {}
