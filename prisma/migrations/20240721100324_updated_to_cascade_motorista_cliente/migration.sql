-- DropForeignKey
ALTER TABLE `cliente` DROP FOREIGN KEY `Cliente_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `motorista` DROP FOREIGN KEY `Motorista_usuarioId_fkey`;

-- AddForeignKey
ALTER TABLE `Motorista` ADD CONSTRAINT `Motorista_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
