-- CreateTable
CREATE TABLE "Logs" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "requestorId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "operation" TEXT,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);
