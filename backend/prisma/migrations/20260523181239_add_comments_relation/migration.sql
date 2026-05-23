/*
  Warnings:

  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Uploads" ADD COLUMN     "commentCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "comments";

-- CreateTable
CREATE TABLE "Comments" (
    "id" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
