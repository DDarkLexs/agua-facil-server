/*
  Warnings:

  - You are about to drop the column `dataAtualizacao` on the `servicosolicitado` table. All the data in the column will be lost.
  - You are about to drop the column `dataSolicitacao` on the `servicosolicitado` table. All the data in the column will be lost.
  - Added the required column `coordenada` to the `ServicoSolicitado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `ServicoSolicitado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicosolicitado` DROP COLUMN `dataAtualizacao`,
    DROP COLUMN `dataSolicitacao`,
    ADD COLUMN `coordenada` VARCHAR(191) NOT NULL,
    ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('PENDENTE', 'ACEITO', 'CONCLUIDO', 'RECUSADO') NOT NULL DEFAULT 'ACEITO';

-- CreateTable
CREATE TABLE `ServicoMotorista` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `preco` DOUBLE NOT NULL DEFAULT 0,
    `ocupado` BOOLEAN NOT NULL DEFAULT false,
    `motoristaId` INTEGER NOT NULL,
    `clienteId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServicoMotorista` ADD CONSTRAINT `ServicoMotorista_motoristaId_fkey` FOREIGN KEY (`motoristaId`) REFERENCES `Motorista`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicoMotorista` ADD CONSTRAINT `ServicoMotorista_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
