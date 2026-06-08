import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddToCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            images: true,
            stock: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addItem(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.id },
    });

    if (!product) throw new NotFoundException('Product not found');
    if (Number(product.stock) < Number(dto.quantity)) {
      throw new BadRequestException(`Only ${product.stock} items available`);
    }

    return this.prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId,
        },
      },
      update: {
        quantity: { increment: Number(dto.quantity) },
      },
      create: {
        userId,
        productId: dto.productId,
        quantity: Number(dto.quantity),
      },
      include: { product: true },
    });
  }

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(userId, itemId);
    }

    // Validasi stock lagi
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!item) throw new NotFoundException('Cart item not found');
    if (item.product.stock < quantity) {
      throw new BadRequestException(`Stock insufficient`);
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true },
    });
  }

  async removeItem(userId: string, itemId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { id: itemId, userId },
    });
  }

  async clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({ where: { userId } });
  }

  async getCartTotal(userId: string) {
    const result = await this.prisma.cartItem.aggregate({
      where: { userId },
      _sum: {
        product: { price: true }, // Perlu adjustment sesuai schema
      },
    });
    // Alternative: hitung manual dengan include product
    const items = await this.getCart(userId);
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }
}
