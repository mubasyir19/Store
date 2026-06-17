import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma.service';
import { MidtransService } from './midtrans.service';
import { WebhookController } from './webhook.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [OrderController, WebhookController],
  providers: [OrderService, PrismaService, MidtransService, ConfigService],
})
export class OrderModule {}
