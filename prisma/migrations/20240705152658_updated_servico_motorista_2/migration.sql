/*
  Warnings:

  - You are about to drop the column `clienteId` on the `servicomotorista` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `servicomotorista` DROP FOREIGN KEY `ServicoMotorista_clienteId_fkey`;

-- AlterTable
ALTER TABLE `servicomotorista` DROP COLUMN `clienteId`;
