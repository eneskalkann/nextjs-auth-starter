-- CreateTable
CREATE TABLE "Il" (
    "id" SERIAL NOT NULL,
    "ilId" INTEGER NOT NULL,
    "ilAdi" TEXT NOT NULL,

    CONSTRAINT "Il_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ilce" (
    "id" SERIAL NOT NULL,
    "ilceAdi" TEXT NOT NULL,
    "ilId" INTEGER NOT NULL,

    CONSTRAINT "Ilce_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Il_ilId_key" ON "Il"("ilId");

-- AddForeignKey
ALTER TABLE "Ilce" ADD CONSTRAINT "Ilce_ilId_fkey" FOREIGN KEY ("ilId") REFERENCES "Il"("ilId") ON DELETE RESTRICT ON UPDATE CASCADE;
