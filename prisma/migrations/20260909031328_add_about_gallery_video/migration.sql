-- CreateTable
CREATE TABLE "about_articles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "content_html" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "gallery_albums" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "gallery_photos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "album_id" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT NOT NULL,
    CONSTRAINT "gallery_photos_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "gallery_albums" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "videos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT,
    "thumbnail_url" TEXT,
    "video_url" TEXT NOT NULL,
    "video_source" TEXT NOT NULL DEFAULT 'OTHER',
    "description_html" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "about_articles_slug_key" ON "about_articles"("slug");
