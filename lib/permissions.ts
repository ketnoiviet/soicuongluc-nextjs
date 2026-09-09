import { ADMIN_ROLES, ADMIN_ROLE_RANK, type AdminRole } from '@/lib/enums'

// Trang mà user nào cũng vào được dù bị giới hạn quyền truy cập, để không ai bị khoá
// hoàn toàn khỏi trang chủ quản trị hoặc trang tự đổi mật khẩu của chính mình.
export const ALWAYS_ALLOWED_HREFS = ['/admin', '/admin/doi-mat-khau']

// rank(target) <= rank(viewer): quyết định 1 user thấy/quản lý được những user nào
// (ẩn hoàn toàn user cấp cao hơn khỏi danh sách, không chỉ ẩn nút thao tác) và được
// gán những vai trò nào khi tạo/sửa user khác.
export function canManageRole(viewerRole: AdminRole, targetRole: AdminRole): boolean {
  return ADMIN_ROLE_RANK[targetRole] <= ADMIN_ROLE_RANK[viewerRole]
}

export function manageableRoles(viewerRole: AdminRole): AdminRole[] {
  return ADMIN_ROLES.filter((r) => ADMIN_ROLE_RANK[r] <= ADMIN_ROLE_RANK[viewerRole])
}

// Cột permissions lưu JSON string (mảng href) hoặc NULL (toàn quyền). NULL không phải
// "[]" — đừng nhầm hai trạng thái này khi đọc/ghi cột.
export function parsePermissions(raw: string | null): string[] | null {
  if (raw === null) return null
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

// SUPERADMIN luôn toàn quyền bất kể cột permissions chứa gì. allowedHrefs === null
// nghĩa là toàn quyền (user cũ/tạo mới trước khi ai đó giới hạn thủ công qua trang Sửa).
// So khớp theo tiền tố có ranh giới "/" để "/admin/san-pham" không vô tình khớp luôn
// "/admin/san-pham-loai" - và luôn so khớp CHÍNH XÁC với "/admin" (trang Dashboard),
// không bao giờ coi nó là tiền tố, nếu không "/admin" sẽ khớp tiền tố với MỌI trang
// quản trị khác (chúng đều bắt đầu bằng "/admin/") và vô hiệu hoá toàn bộ giới hạn.
function hrefMatches(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(href + '/')
}

export function isPathAllowed(pathname: string, role: AdminRole, allowedHrefs: string[] | null): boolean {
  if (role === 'SUPERADMIN') return true
  if (ALWAYS_ALLOWED_HREFS.includes(pathname)) return true
  if (allowedHrefs === null) return true
  return allowedHrefs.some((href) => hrefMatches(pathname, href))
}
