-- AlterTable
ALTER TABLE `motorista` ADD COLUMN `disponivel` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `servicomotorista` ADD COLUMN `litro` DOUBLE NOT NULL DEFAULT 0.0;
