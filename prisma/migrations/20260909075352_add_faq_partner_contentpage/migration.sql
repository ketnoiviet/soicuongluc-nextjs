-- CreateTable
CREATE TABLE "faqs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "question" TEXT NOT NULL,
    "answer_html" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "partners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "logo_url" TEXT,
    "website" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "content_pages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content_html" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "content_pages_slug_key" ON "content_pages"("slug");
