-- CreateTable
CREATE TABLE "why_choose_us_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "customer_name" TEXT NOT NULL,
    "position" TEXT,
    "avatar_url" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "content" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
