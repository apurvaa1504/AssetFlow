-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('asset_assigned', 'maintenance_approved', 'maintenance_rejected', 'booking_confirmed', 'booking_cancelled', 'transfer_requested', 'transfer_approved', 'overdue_return', 'audit_discrepancy_flagged');

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);
