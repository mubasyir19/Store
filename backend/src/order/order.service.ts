import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { MidtransService } from './midtrans.service';

type MidtransNotification = {
  order_id: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_id?: string;
  transaction_time?: string;
  settlement_time?: string;
  va_numbers?: Array<{ va_number: string }>;
  [key: string]: unknown;
};

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private midtransService: MidtransService,
  ) {}

  async checkout(userId: string, checkoutData: CreateOrderDto) {
    console.log('id user = ', userId);
    // const user = await this.prisma.user.findUnique({
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // get cartItem user
    const cartItems = await this.prisma.cartItem.findMany({
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
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Count Shipping Cost
    let shippingCost = new Decimal(0);
    let shippingEta = '';

    switch (checkoutData.shippingMethod) {
      case 'regular':
        shippingCost = new Decimal(10000); // Rp 10.000
        shippingEta = '3-5 working days';
        break;
      case 'express':
        shippingCost = new Decimal(20000); // Rp 20.000
        shippingEta = '1-2 working days';
        break;
      case 'same_day':
        shippingCost = new Decimal(50000); // Rp 50.000
        shippingEta = 'Today (for nearby areas)';
        break;
      default:
        shippingCost = new Decimal(0);
        shippingEta = 'Not available';
    }

    // If there's shipping cost from frontend
    if (checkoutData.shippingCost && checkoutData.shippingCost > 0) {
      shippingCost = new Decimal(checkoutData.shippingCost);
    }

    // loop cartItem fot count total price
    let totalAmount = new Decimal(0);
    const orderItemsData: {
      productId: string;
      quantity: number;
      priceAtPurchase: Decimal;
    }[] = [];

    const midtransItems: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${item.product.name}`,
        );
      }
      const itemPrice = item.product.price;
      const itemTotal = itemPrice.mul(item.quantity);
      totalAmount = totalAmount.add(itemTotal);

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: itemPrice,
      });

      midtransItems.push({
        id: item.productId,
        name: item.product.name.substring(0, 50),
        price: Number(item.product.price),
        quantity: item.quantity,
      });
    }

    // Tota + Shipping
    const totalWithShipping = totalAmount.add(shippingCost);

    const midtransOrderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // db transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // // create new order
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          // totalPrice: totalAmount,
          totalPrice: totalWithShipping, // if there's a shipping fee from frontend
          status: 'Pending',
          midtransOrderId: midtransOrderId,
          shippingName: checkoutData.shippingName,
          shippingPhone: checkoutData.shippingPhone,
          shippingAddress: checkoutData.shippingAddress,
          shippingCity: checkoutData.shippingCity,
          shippingPostalCode: checkoutData.shippingPostalCode,
          shippingNotes: checkoutData.shippingNotes || null,

          shippingMethod: checkoutData.shippingMethod,
          shippingCourier: checkoutData.shippingCourier || null,
          shippingService: checkoutData.shippingService || null,
          shippingCost: shippingCost,
          shippingEta: shippingEta,

          paymentType: checkoutData.paymentMethod,
          paymentStatus: 'pending',

          paymentExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
          orderItem: { create: orderItemsData },
        },
      });

      // // reduce stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    // Add to Midtrans with Shipping
    const midtransItemsWithShipping = [
      ...midtransItems,
      {
        id: 'SHIPPING_COST',
        name: `Ongkos Kirim (${checkoutData.shippingMethod})`,
        price: Number(shippingCost),
        quantity: 1,
      },
    ];

    // payment gateway integration
    const payment = await this.midtransService.createTransaction(
      midtransOrderId,
      // Number(totalAmount),
      Number(totalWithShipping), // 🆕 totalWithShipping
      {
        name: checkoutData.shippingName,
        email: user.email,
        phone: checkoutData.shippingPhone,
      },
      // midtransItems,
      midtransItemsWithShipping,
    );

    await this.prisma.order.update({
      where: { id: result.id },
      data: {
        snapToken: payment.token,
        snapRedirectUrl: payment.redirect_url,
        paymentStatus: 'pending',
      },
    });

    return {
      message: 'Checkout initiated',
      order: {
        id: result.id,
        totalPrice: result.totalPrice,
        status: result.status,
        shippingMethod: result.shippingMethod,
        shippingCost: result.shippingCost,
        shippingEta: result.shippingEta,
      },
      payment: {
        token: payment.token,
        redirect_url: payment.redirect_url,
        order_id: payment.order_id,
      },
    };
  }

  async handlePaymentNotification(notification: MidtransNotification) {
    const statusResponse =
      await this.midtransService.handleNotification(notification);

    const midtransNotif = statusResponse as MidtransNotification;
    const orderId = midtransNotif.order_id;
    const transactionStatus = midtransNotif.transaction_status;
    const fraudStatus = midtransNotif.fraud_status;

    // Find order by midtransOrderId
    const order = await this.prisma.order.findFirst({
      where: { midtransOrderId: orderId },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    let orderStatus:
      | 'Pending'
      | 'Paid'
      | 'Processing'
      | 'Shipped'
      | 'Delivered'
      | 'Cancelled' = order.status;
    let paymentStatus = midtransNotif.transaction_status;

    // Determine order status based on payment status
    if (transactionStatus === 'capture') {
      // capture is for credit card transaction
      if (fraudStatus === 'accept') {
        orderStatus = 'Paid';
      }
    } else if (transactionStatus === 'settlement') {
      orderStatus = 'Paid';
    } else if (transactionStatus === 'pending') {
      orderStatus = 'Pending';
      paymentStatus = 'pending';
    } else if (
      transactionStatus === 'deny' ||
      transactionStatus === 'cancel' ||
      transactionStatus === 'expire'
    ) {
      orderStatus = 'Cancelled';
      paymentStatus = 'failed';

      // Restore stock if payment failed
      if (orderStatus === 'Cancelled') {
        const orderItems = await this.prisma.orderItem.findMany({
          where: { orderId: order.id },
        });

        for (const item of orderItems) {
          await this.prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      }
    }

    // Update order with payment info
    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: orderStatus,
        paymentStatus: paymentStatus,
        paymentType: midtransNotif.payment_type,
        fraudStatus: midtransNotif.fraud_status,
        vaNumber: midtransNotif.va_numbers?.[0]?.va_number,
        transactionId: midtransNotif.transaction_id,
        transactionTime: midtransNotif.transaction_time
          ? new Date(midtransNotif.transaction_time)
          : null,
        settlementTime: midtransNotif.settlement_time
          ? new Date(midtransNotif.settlement_time)
          : null,
        paymentRawResponse: JSON.parse(JSON.stringify(midtransNotif)),
      },
    });

    return { success: true };
  }

  async getOrderStatus(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        orderItem: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    // If payment status is still pending, check latest status from Midtrans
    if (order.paymentStatus === 'pending' && order.midtransOrderId) {
      try {
        const statusResponse =
          await this.midtransService.checkTransactionStatus(
            order.midtransOrderId,
          );

        const status = statusResponse as MidtransNotification;

        // Update status if changed
        if (status.transaction_status !== order.paymentStatus) {
          await this.handlePaymentNotification(status);
        }

        // Refresh order data
        return await this.prisma.order.findFirst({
          where: { id: orderId },
          include: {
            orderItem: {
              include: {
                product: {
                  select: {
                    name: true,
                    images: true,
                    slug: true,
                  },
                },
              },
            },
          },
        });
      } catch (error) {
        // Return existing order if cannot check status
        return order;
      }
    }

    return order;
  }

  async getOrderDetail(orderId: string) {
    const dataOrder = await this.prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!dataOrder) {
      throw new NotFoundException('Order not found');
      return;
    }

    return {
      message: 'Successfully get detail order',
      order: dataOrder,
    };
  }
}
