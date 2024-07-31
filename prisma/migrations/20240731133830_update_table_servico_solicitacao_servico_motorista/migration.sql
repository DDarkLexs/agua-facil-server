/*
  Warnings:

  - You are about to drop the column `endereco` on the `motorista` table. All the data in the column will be lost.
  - You are about to drop the column `coordenada` on the `servicosolicitado` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `servicosolicitado` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `motorista` DROP COLUMN `endereco`;

-- AlterTable
ALTER TABLE `servicomotorista` ADD COLUMN `coordenada` VARCHAR(191) NULL,
    ADD COLUMN `endereco` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `servicosolicitado` DROP COLUMN `coordenada`,
    DROP COLUMN `endereco`;
