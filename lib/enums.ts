// Ràng buộc kiểu cho các cột "soft enum" (String trên SQLite, xem ghi chú
// trong prisma/schema.prisma) — SQLite không hỗ trợ enum thật ở tầng DB.

export const CONTENT_STATUSES = ['PUBLISHED', 'HIDDEN', 'ARCHIVED'] as const
export type ContentStatus = (typeof CONTENT_STATUSES)[number]

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  PUBLISHED: 'Hiển thị',
  HIDDEN: 'Tạm ẩn',
  ARCHIVED: 'Vô hiệu hoá',
}

export const ADMIN_ROLES = ['ADMIN', 'EDITOR'] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  ADMIN: 'Quản trị viên',
  EDITOR: 'Biên tập viên',
}

export const INQUIRY_TYPES = ['GENERAL_CONTACT', 'QUOTE_REQUEST'] as const
export type InquiryType = (typeof INQUIRY_TYPES)[number]

export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  GENERAL_CONTACT: 'Liên hệ',
  QUOTE_REQUEST: 'Yêu cầu báo giá',
}

export const CONTACT_STATUSES = ['PENDING', 'RESOLVED'] as const
export type ContactStatus = (typeof CONTACT_STATUSES)[number]

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  PENDING: 'Chưa xử lý',
  RESOLVED: 'Đã xử lý',
}
