// Hằng số dùng chung giữa client component và API route - không import 'server-only' vì
// file này cần đọc được từ cả client (GalleryUploadForm.tsx) lẫn server (route.ts).
export const PRODUCT_GALLERY_MAX_FILES = 30
