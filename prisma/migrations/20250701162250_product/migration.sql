/*
  Warnings:

  - You are about to drop the `Products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ProductCategories" DROP CONSTRAINT "_ProductCategories_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductTags" DROP CONSTRAINT "_ProductTags_A_fkey";

-- DropTable
DROP TABLE "Products";

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "isOnSale" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL,
    "fixed_price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "isOnShopPage" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTags" ADD CONSTRAINT "_ProductTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
