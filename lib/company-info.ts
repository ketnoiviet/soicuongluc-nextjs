import { cache } from 'react'
import { prisma } from '@/lib/prisma'

export type CompanyInfo = {
  companyName: string
  tagline: string
  phone: string
  phone2: string
  email: string
  zalo: string
  facebook: string
  messenger: string
  addressHcm: string
  addressHn: string
  addressDn: string
  addressWarehouse: string
  workingHours: string
  mapEmbedUrl: string
}

// Rỗng theo mặc định - đây là code dùng chung cho nhiều dự án (xem "Cấu hình website" trong
// admin), không phải chỗ để hard-code thông tin liên hệ của một khách hàng cụ thể nào. Admin
// điền qua trang /admin/cau-hinh (bảng SiteSetting) - Header/Footer tự ẩn phần nào chưa có
// giá trị thay vì hiện chuỗi rỗng.
const EMPTY: CompanyInfo = {
  companyName: '',
  tagline: '',
  phone: '',
  phone2: '',
  email: '',
  zalo: '',
  facebook: '',
  messenger: '',
  addressHcm: '',
  addressHn: '',
  addressDn: '',
  addressWarehouse: '',
  workingHours: '',
  mapEmbedUrl: '',
}

// Ánh xạ field -> key thật lưu trong bảng site_settings (key/value chung, xem prisma/seed.js).
const KEY_MAP: Record<keyof CompanyInfo, string> = {
  companyName: 'ten_cong_ty',
  tagline: 'tagline',
  phone: 'dien_thoai',
  phone2: 'dien_thoai_2',
  email: 'email',
  zalo: 'zalo',
  facebook: 'facebook',
  messenger: 'messenger',
  addressHcm: 'dia_chi_hcm',
  addressHn: 'dia_chi_hn',
  addressDn: 'dia_chi_dn',
  addressWarehouse: 'kho_hang',
  workingHours: 'gio_lam_viec',
  mapEmbedUrl: 'ban_do_embed',
}

const ALL_KEYS = Object.values(KEY_MAP)

/**
 * Đọc thông tin liên hệ/công ty dùng cho Header/Footer trang công khai - từ bảng SiteSetting
 * chung (trang "Cấu hình website" trong admin), không hard-code trong component. Bọc React
 * cache() để dùng được ở nhiều component (Header, Footer) trong cùng 1 request mà chỉ tốn 1
 * lượt truy vấn DB.
 */
export const getCompanyInfo = cache(async (): Promise<CompanyInfo> => {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: ALL_KEYS } },
    select: { key: true, value: true },
  })
  const byKey = new Map(rows.map((r) => [r.key, r.value || '']))

  const result = { ...EMPTY }
  for (const field of Object.keys(KEY_MAP) as (keyof CompanyInfo)[]) {
    const value = byKey.get(KEY_MAP[field])
    if (value) result[field] = value
  }
  return result
})
