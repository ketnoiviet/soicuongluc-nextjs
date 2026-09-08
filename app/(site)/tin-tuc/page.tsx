import { prisma } from '@/lib/prisma'
import { NewsCardVertical } from '@/components/ui/Cards'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tin tức & Kiến thức sợi cường lực | HARIFA',
  description: 'Cập nhật tin tức mới nhất về ngành sợi cường lực, polyester, nylon, carbon từ HARIFA',
}

export default async function TinTucPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Math.max(1, parseInt(searchParams.page || '1'))
  const pageSize = 9

  const [total, articles, categories] = await Promise.all([
    prisma.newsArticle.count({ where: { status: 'PUBLISHED' } }),
    prisma.newsArticle.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.newsCategory.findMany({ where: { status: 'PUBLISHED' }, orderBy: { sortOrder: 'asc' } }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <>
      <div className="breadcrumb">
        <div className="container">
          <ol>
            <li><Link href="/">Trang chủ</Link></li>
            <li>Tin tức</li>
          </ol>
        </div>
      </div>

      <section className="page-section">
        <div className="container">
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Sidebar */}
            <aside style={{ width: 220, flexShrink: 0 }}>
              <div style={{ background: 'var(--primary)', color: '#fff', padding: '12px 16px', borderRadius: '8px 8px 0 0', fontWeight: 700, fontSize: 14 }}>
                📰 Chuyên mục
              </div>
              <ul style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                <li>
                  <Link href="/tin-tuc" style={{ display: 'block', padding: '10px 16px', fontSize: 13, borderBottom: '1px solid var(--bg-gray)' }}>
                    Tất cả bài viết
                  </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link href={`/tin-tuc?loai=${cat.slug}`} style={{ display: 'block', padding: '10px 16px', fontSize: 13, borderBottom: '1px solid var(--bg-gray)', color: 'var(--text-dark)' }}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Main */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)', marginBottom: 20 }}>
                Tin tức & Kiến thức
              </h1>

              {articles.length === 0 ? (
                <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: 40 }}>Chưa có bài viết nào.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
                  {articles.map(a => <NewsCardVertical key={a.id} article={a} />)}
                </div>
              )}

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="pagination">
                  {page > 1 && <Link href={`/tin-tuc?page=${page - 1}`}>‹</Link>}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Link key={p} href={`/tin-tuc?page=${p}`} className={p === page ? 'active' : ''}>{p}</Link>
                  ))}
                  {page < totalPages && <Link href={`/tin-tuc?page=${page + 1}`}>›</Link>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
