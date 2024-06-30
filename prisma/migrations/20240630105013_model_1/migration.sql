/*
  Warnings:

  - A unique constraint covering the columns `[telefone]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Usuario_email_key` ON `usuario`;

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_telefone_key` ON `Usuario`(`telefone`);
