/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Products" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isOnSale" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL,
    "fixed_price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "isOnShopPage" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductTags_B_index" ON "_ProductTags"("B");

-- CreateIndex
CREATE INDEX "_ProductCategories_B_index" ON "_ProductCategories"("B");

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTags" ADD CONSTRAINT "_ProductTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTags" ADD CONSTRAINT "_ProductTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
