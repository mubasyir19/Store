import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly orderService: OrderService) {}

  @Post('midtrans')
  @HttpCode(200)
  async handleMidtransWebhook(@Body() notification: any) {
    await this.orderService.handlePaymentNotification(notification);
    return { status: 'OK' };
  }
}
