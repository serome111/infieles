-- CreateTable
CREATE TABLE "Cheater" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "infidelityPeriod" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "additionalData" TEXT,
    "proofLinks" TEXT,
    "socialNetworks" TEXT,
    "locationCountry" TEXT,
    "locationState" TEXT,
    "locationCity" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cheater_pkey" PRIMARY KEY ("id")
);
