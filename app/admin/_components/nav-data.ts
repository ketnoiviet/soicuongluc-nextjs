import {
  LayoutDashboard,
  FolderTree,
  Package,
  FolderOpen,
  Newspaper,
  Info,
  Images,
  Video,
  GalleryHorizontal,
  LayoutPanelLeft,
  Mail,
  Settings,
  Users,
  KeyRound,
  Building2,
  ShieldCheck,
  Star,
  FolderCog,
  HelpCircle,
  Handshake,
  FileText,
  Search,
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
    // Gộp Sản phẩm + Giới thiệu + Tin tức + Thư viện thành 1 nhóm "Dữ liệu" -
    // đây đều là nội dung/dữ liệu hiển thị công khai, khác với "Giao diện" (banner/panel
    // thuần trang trí) và "Hệ thống" (cấu hình/vận hành nội bộ).
    label: 'Dữ liệu',
    items: [
      { href: '/admin/san-pham-loai', label: 'Danh mục sản phẩm', icon: FolderTree },
      { href: '/admin/san-pham', label: 'Sản phẩm', icon: Package },
      { href: '/admin/nha-san-xuat', label: 'Nhà sản xuất', icon: Building2 },
      { href: '/admin/gioi-thieu', label: 'Bài viết giới thiệu', icon: Info },
      { href: '/admin/bai-viet-loai', label: 'Danh mục tin tức', icon: FolderOpen },
      { href: '/admin/bai-viet', label: 'Bài viết', icon: Newspaper },
      { href: '/admin/hinh-anh', label: 'Album ảnh', icon: Images },
      { href: '/admin/videos', label: 'Videos', icon: Video },
      { href: '/admin/vi-sao-chon-chung-toi', label: 'Vì sao chọn chúng tôi?', icon: ShieldCheck },
      { href: '/admin/nhan-xet-khach-hang', label: 'Nhận xét của khách hàng', icon: Star },
      { href: '/admin/hoi-dap', label: 'Hỏi đáp', icon: HelpCircle },
      { href: '/admin/doi-tac-khach-hang', label: 'Đối tác & Khách hàng', icon: Handshake },
      { href: '/admin/trang-noi-dung', label: 'Trang nội dung', icon: FileText },
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
      { href: '/admin/quan-ly-media', label: 'Quản lý Media', icon: FolderCog },
      { href: '/admin/cau-hinh', label: 'Cấu hình website', icon: Settings },
      { href: '/admin/cai-dat-seo', label: 'Cài đặt SEO', icon: Search },
      { href: '/admin/nguoi-dung', label: 'Tài khoản quản trị', icon: Users },
      { href: '/admin/doi-mat-khau', label: 'Đổi mật khẩu', icon: KeyRound },
    ],
  },
]

export const navItemsFlat: NavItem[] = navGroups.flatMap((g) => g.items)
