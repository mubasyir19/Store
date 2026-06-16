/*
  Warnings:

  - The values [Completed] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[midtrans_order_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled');
ALTER TABLE "public"."Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "fraud_status" TEXT,
ADD COLUMN     "midtrans_order_id" TEXT,
ADD COLUMN     "payment_expiry" TIMESTAMP(3),
ADD COLUMN     "payment_raw_response" JSONB,
ADD COLUMN     "payment_status" TEXT,
ADD COLUMN     "payment_type" TEXT,
ADD COLUMN     "settlement_time" TIMESTAMP(3),
ADD COLUMN     "shippingAddress" TEXT,
ADD COLUMN     "shippingPhone" TEXT,
ADD COLUMN     "snap_redirect_url" TEXT,
ADD COLUMN     "snap_token" TEXT,
ADD COLUMN     "transaction_id" TEXT,
ADD COLUMN     "transaction_time" TIMESTAMP(3),
ADD COLUMN     "va_number" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_midtrans_order_id_key" ON "Order"("midtrans_order_id");

-- CreateIndex
CREATE INDEX "Order_midtrans_order_id_idx" ON "Order"("midtrans_order_id");

-- CreateIndex
CREATE INDEX "Order_payment_status_idx" ON "Order"("payment_status");
