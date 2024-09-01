/*
  Warnings:

  - You are about to drop the column `sSNotaPagamentoId` on the `servicosolicitado` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `servicosolicitado` DROP FOREIGN KEY `ServicoSolicitado_sSNotaPagamentoId_fkey`;

-- AlterTable
ALTER TABLE `servicosolicitado` DROP COLUMN `sSNotaPagamentoId`;

-- AlterTable
ALTER TABLE `ssnotapagamento` ADD COLUMN `servicoSolicitadoId` INTEGER NULL,
    ALTER COLUMN `valor` DROP DEFAULT,
    ALTER COLUMN `formaDePagamento` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `SSNotaPagamento` ADD CONSTRAINT `SSNotaPagamento_servicoSolicitadoId_fkey` FOREIGN KEY (`servicoSolicitadoId`) REFERENCES `ServicoSolicitado`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
