// Ràng buộc kiểu cho các cột "soft enum" (String trên SQLite, xem ghi chú
// trong prisma/schema.prisma) — SQLite không hỗ trợ enum thật ở tầng DB.

export const CONTENT_STATUSES = ['PUBLISHED', 'HIDDEN', 'ARCHIVED'] as const
export type ContentStatus = (typeof CONTENT_STATUSES)[number]

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  PUBLISHED: 'Hiển thị',
  HIDDEN: 'Tạm ẩn',
  ARCHIVED: 'Vô hiệu hoá',
}

export const ADMIN_ROLES = ['SUPERADMIN', 'ADMIN', 'EDITOR'] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  SUPERADMIN: 'Superadmin (kỹ thuật)',
  ADMIN: 'Quản trị viên',
  EDITOR: 'Biên tập viên',
}

/// Thứ bậc vai trò — dùng để quyết định 1 user được thấy/quản lý những user nào
/// (rank(target) <= rank(viewer)) và được gán những vai trò nào. Xem lib/permissions.ts.
export const ADMIN_ROLE_RANK: Record<AdminRole, number> = {
  SUPERADMIN: 3,
  ADMIN: 2,
  EDITOR: 1,
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

export const VIDEO_SOURCES = ['YOUTUBE', 'FACEBOOK', 'OTHER'] as const
export type VideoSource = (typeof VIDEO_SOURCES)[number]

export const VIDEO_SOURCE_LABELS: Record<VideoSource, string> = {
  YOUTUBE: 'YouTube',
  FACEBOOK: 'Facebook',
  OTHER: 'Khác',
}

export const STRUCTURED_DATA_TYPES = ['Organization', 'LocalBusiness', 'WebSite', 'Product', 'BreadcrumbList'] as const
export type StructuredDataType = (typeof STRUCTURED_DATA_TYPES)[number]

export const STRUCTURED_DATA_TYPE_LABELS: Record<StructuredDataType, string> = {
  Organization: 'Organization (Tổ chức/Doanh nghiệp)',
  LocalBusiness: 'LocalBusiness (Doanh nghiệp địa phương)',
  WebSite: 'WebSite (Trang web)',
  Product: 'Product (Sản phẩm)',
  BreadcrumbList: 'BreadcrumbList (Điều hướng breadcrumb)',
}
