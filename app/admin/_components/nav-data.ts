import {
  LayoutDashboard,
  FolderTree,
  Package,
  FolderOpen,
  Newspaper,
  GalleryHorizontal,
  LayoutPanelLeft,
  Mail,
  Settings,
  Users,
  KeyRound,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = { href: string; label: string; icon: LucideIcon }
export type NavGroup = { label: string; items: NavItem[] }

export const navGroups: NavGroup[] = [
  {
    label: 'Tổng quan',
    items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Sản phẩm',
    items: [
      { href: '/admin/san-pham-loai', label: 'Danh mục sản phẩm', icon: FolderTree },
      { href: '/admin/san-pham', label: 'Sản phẩm', icon: Package },
    ],
  },
  {
    label: 'Tin tức',
    items: [
      { href: '/admin/bai-viet-loai', label: 'Danh mục tin tức', icon: FolderOpen },
      { href: '/admin/bai-viet', label: 'Bài viết', icon: Newspaper },
    ],
  },
  {
    label: 'Giao diện',
    items: [
      { href: '/admin/banner-slide', label: 'Banner slide', icon: GalleryHorizontal },
      { href: '/admin/panel', label: 'Panel quảng cáo', icon: LayoutPanelLeft },
    ],
  },
  {
    label: 'Khách hàng',
    items: [{ href: '/admin/lien-he', label: 'Liên hệ khách hàng', icon: Mail }],
  },
  {
    label: 'Hệ thống',
    items: [
      { href: '/admin/cau-hinh', label: 'Cấu hình website', icon: Settings },
      { href: '/admin/nguoi-dung', label: 'Tài khoản quản trị', icon: Users },
      { href: '/admin/doi-mat-khau', label: 'Đổi mật khẩu', icon: KeyRound },
    ],
  },
]

export const navItemsFlat: NavItem[] = navGroups.flatMap((g) => g.items)
