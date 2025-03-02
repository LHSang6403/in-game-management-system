/*
  Warnings:

  - A unique constraint covering the columns `[userId,device]` on the table `UserToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserToken_userId_device_key" ON "UserToken"("userId", "device");
