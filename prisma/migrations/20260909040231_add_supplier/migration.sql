-- CreateTable
CREATE TABLE "suppliers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logo_url" TEXT,
    "website" TEXT,
    "description_html" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AlterTable: products.manufacturer (free text) -> products.supplier_id (FK to suppliers)
ALTER TABLE "products" DROP COLUMN "manufacturer";
ALTER TABLE "products" ADD COLUMN "supplier_id" INTEGER;
