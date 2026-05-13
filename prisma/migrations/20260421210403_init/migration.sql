-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('fulfilled', 'shipped', 'awaitingShipment');

-- CreateEnum
CREATE TYPE "CaseColor" AS ENUM ('black', 'green', 'red');

-- CreateEnum
CREATE TYPE "PhoneModel" AS ENUM ('iPhoneX', 'iPhone11', 'iPhone12', 'iPhone13', 'iPhone14', 'iPhone15', 'iPhone16', 'iPhone17');

-- CreateEnum
CREATE TYPE "CaseMaterial" AS ENUM ('silicone', 'leather');

-- CreateEnum
CREATE TYPE "CaseFinish" AS ENUM ('smooth', 'textured');

-- AlterTable
ALTER TABLE "Configuration" ADD COLUMN     "color" "CaseColor",
ADD COLUMN     "finish" "CaseFinish",
ADD COLUMN     "material" "CaseMaterial",
ADD COLUMN     "model" "PhoneModel";
