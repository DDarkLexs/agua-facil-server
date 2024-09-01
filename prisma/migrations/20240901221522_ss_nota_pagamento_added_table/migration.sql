/*
  Warnings:

  - Added the required column `sSNotaPagamentoId` to the `ServicoSolicitado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicosolicitado` ADD COLUMN `sSNotaPagamentoId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `SSNotaPagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` DOUBLE NOT NULL DEFAULT 0,
    `formaDePagamento` VARCHAR(191) NOT NULL DEFAULT 'Númerario',
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServicoSolicitado` ADD CONSTRAINT `ServicoSolicitado_sSNotaPagamentoId_fkey` FOREIGN KEY (`sSNotaPagamentoId`) REFERENCES `SSNotaPagamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
