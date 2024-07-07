/*
  Warnings:

  - A unique constraint covering the columns `[motoristaId]` on the table `ServicoMotorista` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ServicoMotorista_motoristaId_key` ON `ServicoMotorista`(`motoristaId`);
