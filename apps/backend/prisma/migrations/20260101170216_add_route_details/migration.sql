/*
  Warnings:

  - A unique constraint covering the columns `[routeNumber]` on the table `Route` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `routeNumber` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routePath` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "routeNumber" TEXT NOT NULL,
ADD COLUMN     "routePath" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Route_routeNumber_key" ON "Route"("routeNumber");
