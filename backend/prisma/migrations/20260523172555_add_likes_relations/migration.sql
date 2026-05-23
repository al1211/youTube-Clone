/*
  Warnings:

  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Uploads" ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "likes";

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_uploadId_key" ON "Like"("userId", "uploadId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
