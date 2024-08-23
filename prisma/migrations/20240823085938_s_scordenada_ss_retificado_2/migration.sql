/*
  Warnings:

  - You are about to drop the column `latitude` on the `sscoordenada` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `sscoordenada` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sscoordenada` DROP COLUMN `latitude`,
    DROP COLUMN `longitude`,
    ADD COLUMN `cordenada` VARCHAR(191) NULL DEFAULT '0,0';
