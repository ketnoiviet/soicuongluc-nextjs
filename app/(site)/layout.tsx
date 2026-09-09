import { prisma } from '@/lib/prisma'
import { getSeoSettings } from '@/lib/seo-settings'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Header là Client Component (dropdown cần useState) nên không tự query DB được -
  // lấy danh sách bài viết Giới thiệu + logo (Cài đặt SEO) ở đây (Server Component) rồi
  // truyền xuống làm props.
  const [introArticles, seo] = await Promise.all([
    prisma.aboutArticle.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
      select: { title: true, slug: true },
    }),
    getSeoSettings(),
  ])

  return (
    <>
      <Header introArticles={introArticles} logoUrl={seo?.logoUrl} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
