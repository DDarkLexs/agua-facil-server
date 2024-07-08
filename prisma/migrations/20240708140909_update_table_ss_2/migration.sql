/*
  Warnings:

  - You are about to drop the column `litro` on the `servicomotorista` table. All the data in the column will be lost.
  - Added the required column `litroAgua` to the `ServicoSolicitado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `ServicoSolicitado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicomotorista` DROP COLUMN `litro`,
    ADD COLUMN `litroAgua` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `servicosolicitado` ADD COLUMN `litroAgua` DOUBLE NOT NULL,
    ADD COLUMN `titulo` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('PENDENTE', 'ACEITO', 'CONCLUIDO', 'RECUSADO') NOT NULL DEFAULT 'PENDENTE';
