// Hằng số dùng chung giữa client component và API route - không import 'server-only' vì
// file này cần đọc được từ cả client (GalleryUploadForm.tsx) lẫn server (route.ts).
export const PRODUCT_GALLERY_MAX_FILES = 30
export const GALLERY_ALBUM_MAX_FILES = 30

// Độ dài mật khẩu tối thiểu cho tài khoản admin (tạo mới/đổi mật khẩu) - dùng chung cho cả
// validate phía server (actions.ts) lẫn thuộc tính minLength phía client (input password).
export const MIN_PASSWORD_LENGTH = 8
