/*
  Warnings:

  - You are about to drop the `Il` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ilce` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ilce" DROP CONSTRAINT "Ilce_ilId_fkey";

-- DropTable
DROP TABLE "Il";

-- DropTable
DROP TABLE "Ilce";
