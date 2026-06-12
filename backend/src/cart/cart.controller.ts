import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: RequestWithUser) {
    return this.cartService.getCart(req.user.sub);
  }

  @Post('add')
  async addToCart(@Req() req: RequestWithUser, @Body() dto: AddToCartDto) {
    console.log('user = ', req.user);
    return this.cartService.addItem(req.user.sub, dto);
  }

  @Patch('edit/:itemId')
  async updateQuantity(
    @Req() req: RequestWithUser,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    console.log('controller update quantity = ', quantity);
    return this.cartService.updateQuantity(req.user.sub, itemId, quantity);
  }

  @Delete('remove/:itemId')
  async removeItem(
    @Req() req: RequestWithUser,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeItem(req.user.sub, itemId);
  }

  @Delete()
  async clearCart(@Req() req: RequestWithUser) {
    return this.cartService.clearCart(req.user.sub);
  }

  @Get('total')
  async getTotal(@Req() req: RequestWithUser) {
    return { total: await this.cartService.getCartTotal(req.user.sub) };
  }
}
