-- DropIndex
DROP INDEX "Exercise_id_name_idx";

-- CreateIndex
CREATE INDEX "Exercise_name_idx" ON "Exercise"("name");
