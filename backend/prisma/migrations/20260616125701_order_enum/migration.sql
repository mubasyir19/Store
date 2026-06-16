-- CreateEnum
CREATE TYPE "PaymentOrderType" AS ENUM ('Credit_Card', 'Bank_Transfer', 'Gopay', 'Dana');

-- CreateEnum
CREATE TYPE "PaymentOrderStatus" AS ENUM ('Pending', 'Settlement', 'Capture', 'Expire', 'Cancel');

-- CreateEnum
CREATE TYPE "FraudOrderStatus" AS ENUM ('Accept', 'Deny', 'Challenge');
