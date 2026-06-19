import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  checkout(
    @Req() req: RequestWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.checkout(req.user.sub, createOrderDto);
  }

  @Get()
  getOrderStatus(@Req() req: RequestWithUser, @Param('id') orderId: string) {
    return this.orderService.getOrderStatus(orderId, req.user.sub);
  }

  @Get('all')
  getListOrder(@Req() req: RequestWithUser) {
    return this.orderService.getListOrder(req.user.sub);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrderDetail(id);
  }
}
