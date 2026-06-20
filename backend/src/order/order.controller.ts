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
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleUser } from 'src/auth/dto/create-auth.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUser.Customer)
  @Post('checkout')
  checkout(
    @Req() req: RequestWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.checkout(req.user.sub, createOrderDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUser.Admin)
  @Get('all')
  getAllOrder() {
    return this.orderService.getAllOrder();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUser.Customer)
  @Get('user/all')
  getListOrderUser(@Req() req: RequestWithUser) {
    return this.orderService.getListOrderUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUser.Admin, RoleUser.Admin)
  @Get('status/:id')
  getOrderStatus(@Req() req: RequestWithUser, @Param('id') orderId: string) {
    return this.orderService.getOrderStatus(orderId, req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUser.Admin, RoleUser.Admin)
  @Get(':id')
  async getOrder(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.orderService.getOrderDetail(id, req.user.sub);
  }
}
