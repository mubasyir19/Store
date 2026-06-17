/*
  Warnings:

  - You are about to drop the column `shippingAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingPhone` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingAddress",
DROP COLUMN "shippingPhone",
ADD COLUMN     "shipping_address" TEXT,
ADD COLUMN     "shipping_city" TEXT,
ADD COLUMN     "shipping_cost" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "shipping_courier" TEXT,
ADD COLUMN     "shipping_eta" TEXT,
ADD COLUMN     "shipping_method" TEXT NOT NULL DEFAULT 'regular',
ADD COLUMN     "shipping_name" TEXT,
ADD COLUMN     "shipping_notes" TEXT,
ADD COLUMN     "shipping_phone" TEXT,
ADD COLUMN     "shipping_postal_code" TEXT,
ADD COLUMN     "shipping_service" TEXT,
ADD COLUMN     "tracking_number" TEXT,
ADD COLUMN     "tracking_url" TEXT;
