import { prisma } from '@/lib/prisma'
import { getSeoSettings } from '@/lib/seo-settings'
import { getCompanyInfo } from '@/lib/company-info'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Header/Footer là Client/Server Component thuần hiển thị, không tự query DB - lấy hết dữ
  // liệu (bài viết Giới thiệu, logo, thông tin liên hệ, danh mục sản phẩm cấp 1) ở đây rồi
  // truyền xuống làm props, để đổi sang khách hàng khác chỉ cần đổi dữ liệu trong admin, không
  // phải sửa code Header/Footer.
  const [introArticles, seo, companyInfo, categories] = await Promise.all([
    prisma.aboutArticle.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
      select: { title: true, slug: true },
    }),
    getSeoSettings(),
    getCompanyInfo(),
    prisma.productCategory.findMany({
      where: { status: 'PUBLISHED', parentId: null },
      orderBy: { sortOrder: 'asc' },
      select: { name: true, slug: true },
    }),
  ])

  return (
    <>
      <Header introArticles={introArticles} logoUrl={seo?.logoUrl} companyInfo={companyInfo} categories={categories} />
      <main>{children}</main>
      <Footer companyInfo={companyInfo} categories={categories} />
    </>
  )
}
