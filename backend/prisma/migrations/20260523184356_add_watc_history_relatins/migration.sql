/*
  Warnings:

  - You are about to drop the `wathHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Uploads" ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "wathHistory";

-- CreateTable
CREATE TABLE "WatchHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WatchHistory_userId_uploadId_key" ON "WatchHistory"("userId", "uploadId");

-- AddForeignKey
ALTER TABLE "WatchHistory" ADD CONSTRAINT "WatchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchHistory" ADD CONSTRAINT "WatchHistory_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
