-- CreateTable
CREATE TABLE `SSCoordenada` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `endereco` VARCHAR(191) NULL DEFAULT 'Sem endereço dispónivel',
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,
    `servicoSolicitadoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SSCoordenada` ADD CONSTRAINT `SSCoordenada_servicoSolicitadoId_fkey` FOREIGN KEY (`servicoSolicitadoId`) REFERENCES `ServicoSolicitado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
