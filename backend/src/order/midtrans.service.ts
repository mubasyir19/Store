import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as midtransClient from 'midtrans-client';

type MidtransTransactionApi = {
  status(orderId: string): Promise<unknown>;
  notification(notification: unknown): Promise<unknown>;
};

type MidtransCoreApi = midtransClient.CoreApi & {
  transaction: MidtransTransactionApi;
};

@Injectable()
export class MidtransService {
  private snap: midtransClient.Snap;
  private core: midtransClient.CoreApi;

  private get coreWithTransaction(): MidtransCoreApi {
    return this.core as MidtransCoreApi;
  }

  constructor(private configService: ConfigService) {
    const serverKey = this.configService.get<string>('MIDTRANS_SERVER_KEY');
    const clientKey = this.configService.get<string>('MIDTRANS_CLIENT_KEY');
    const isProduction =
      this.configService.get('MIDTRANS_IS_PRODUCTION') === 'true';

    if (!serverKey) {
      throw new Error(
        'MIDTRANS_SERVER_KEY is required for Midtrans integration',
      );
    }

    if (!clientKey) {
      throw new Error(
        'MIDTRANS_CLIENT_KEY is required for Midtrans integration',
      );
    }

    this.snap = new midtransClient.Snap({
      isProduction,
      serverKey,
      clientKey,
    });

    this.core = new midtransClient.CoreApi({
      isProduction,
      serverKey,
      clientKey,
    });
  }

  async createTransaction(
    orderId: string,
    totalAmount: number,
    customerDetails: {
      name: string;
      email: string;
      phone?: string;
    },
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>,
  ) {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      customer_details: {
        first_name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone || '',
      },
      item_details: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      // Optional: Set expiry (default 24 jam)
      expiry: {
        start_time: new Date().toISOString(),
        duration: 24,
        unit: 'hours',
      },
    };
    const transaction = await this.snap.createTransaction(parameter);

    return {
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId,
    };
  }

  async checkTransactionStatus(orderId: string): Promise<unknown> {
    return this.coreWithTransaction.transaction.status(orderId);
  }

  async handleNotification(notification: unknown): Promise<unknown> {
    return this.coreWithTransaction.transaction.notification(notification);
  }
}
