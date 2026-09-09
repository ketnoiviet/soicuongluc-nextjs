-- CreateTable
CREATE TABLE "seo_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "canonical_url" TEXT,
    "robots_meta" TEXT NOT NULL DEFAULT 'index, follow',
    "og_type" TEXT NOT NULL DEFAULT 'website',
    "og_url" TEXT,
    "og_title" TEXT,
    "og_description" TEXT,
    "og_image" TEXT,
    "twitter_card" TEXT NOT NULL DEFAULT 'summary_large_image',
    "twitter_title" TEXT,
    "twitter_description" TEXT,
    "twitter_image" TEXT,
    "logo_url" TEXT,
    "favicon_url" TEXT NOT NULL DEFAULT '/favicon.ico',
    "apple_touch_icon_url" TEXT NOT NULL DEFAULT '/apple-touch-icon.png',
    "structured_data_type" TEXT NOT NULL DEFAULT 'Organization',
    "structured_data_json" TEXT,
    "updated_at" DATETIME NOT NULL
);
