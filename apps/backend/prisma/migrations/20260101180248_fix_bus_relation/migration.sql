-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "stops" TEXT[];

-- CreateTable
CREATE TABLE "LiveBusLocation" (
    "id" TEXT NOT NULL,
    "busId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveBusLocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LiveBusLocation" ADD CONSTRAINT "LiveBusLocation_busId_fkey" FOREIGN KEY ("busId") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
