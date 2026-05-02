/*
  Warnings:

  - You are about to drop the column `token` on the `refresh_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hash_token]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sid]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hash_token` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sid` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "token",
ADD COLUMN     "hash_token" TEXT NOT NULL,
ADD COLUMN     "sid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_hash_token_key" ON "refresh_tokens"("hash_token");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_sid_key" ON "refresh_tokens"("sid");
