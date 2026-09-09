// Tên website hiển thị trong thẻ <title> các trang công khai (vd "Tên bài viết | Tên website")
// - đọc từ NEXT_PUBLIC_SITE_NAME (.env), không hard-code tên 1 khách hàng cụ thể trong code vì
// đây là khung dùng chung cho nhiều dự án.
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Website'
