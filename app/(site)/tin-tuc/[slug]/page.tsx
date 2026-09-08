import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl, formatDate } from '@/lib/utils'
import { NewsCard } from '@/components/ui/Cards'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.newsArticle.findFirst({ where: { slug: params.slug } })
  if (!article) return { title: 'Bài viết không tồn tại' }
  return {
    title: `${article.title} | HARIFA`,
    description: article.excerpt?.substring(0, 160) || '',
  }
}

export default async function TinTucDetailPage({ params }: Props) {
  const article = await prisma.newsArticle.findFirst({
    where: { slug: params.slug, status: 'PUBLISHED' },
    include: { category: true },
  })
  if (!article) notFound()

  // Tăng lượt xem
  await prisma.newsArticle.update({ where: { id: article.id }, data: { viewCount: (article.viewCount || 0) + 1 } })

  const relatedArticles = await prisma.newsArticle.findMany({
    where: { categoryId: article.categoryId, status: 'PUBLISHED', id: { not: article.id } },
    take: 4, orderBy: { publishedAt: 'desc' },
  })

  return (
    <>
      <div className="breadcrumb">
        <div className="container">
          <ol>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/tin-tuc">Tin tức</Link></li>
            {article.category && <li><Link href="/tin-tuc">{article.category.name}</Link></li>}
            <li style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</li>
          </ol>
        </div>
      </div>

      <section className="page-section">
        <div className="container">
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Main article */}
            <article style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.3, marginBottom: 10 }}>
                {article.title}
              </h1>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-light)', marginBottom: 20, flexWrap: 'wrap' }}>
                <span>📅 {formatDate(article.publishedAt)}</span>
                {article.author && <span>✍️ {article.author}</span>}
                <span>👁 {article.viewCount} lượt xem</span>
              </div>

              {article.coverImageUrl && (
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
                  <Image src={getImageUrl(article.coverImageUrl)} alt={article.title || ''} fill style={{ objectFit: 'cover' }} priority />
                </div>
              )}

              {article.excerpt && (
                <div style={{ padding: '14px 18px', background: 'var(--bg-light)', borderLeft: '4px solid var(--primary)', borderRadius: '0 8px 8px 0', marginBottom: 24, fontSize: 15, color: 'var(--text-gray)', fontStyle: 'italic', lineHeight: 1.8 }}>
                  {article.excerpt}
                </div>
              )}

              <div className="rich-content" dangerouslySetInnerHTML={{ __html: article.contentHtml || '' }} />

              {/* Share */}
              <div style={{ marginTop: 24, padding: '16px', background: 'var(--bg-light)', borderRadius: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Chia sẻ bài viết:</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://soicuongluc.com/tin-tuc/${article.slug}`)}`}
                    target="_blank" rel="noopener"
                    style={{ background: '#3b5998', color: '#fff', padding: '6px 14px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                    Facebook
                  </a>
                  <a href={`https://zalo.me/share?url=${encodeURIComponent(`https://soicuongluc.com/tin-tuc/${article.slug}`)}`}
                    target="_blank" rel="noopener"
                    style={{ background: '#0068ff', color: '#fff', padding: '6px 14px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                    Zalo
                  </a>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside style={{ width: 280, flexShrink: 0 }}>
              <div style={{ background: 'var(--primary)', color: '#fff', padding: '10px 14px', borderRadius: '8px 8px 0 0', fontWeight: 700, fontSize: 13 }}>
                📰 Bài viết liên quan
              </div>
              <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                {relatedArticles.length === 0
                  ? <p style={{ padding: 14, fontSize: 13, color: 'var(--text-light)' }}>Chưa có bài viết liên quan.</p>
                  : relatedArticles.map(a => (
                    <div key={a.id} style={{ borderBottom: '1px solid var(--bg-gray)' }}>
                      <NewsCard article={a} />
                    </div>
                  ))
                }
              </div>

              {/* CTA */}
              <div style={{ marginTop: 16, background: 'var(--primary)', color: '#fff', padding: 16, borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: 13, marginBottom: 10, color: 'rgba(255,255,255,0.9)' }}>Cần tư vấn sản phẩm?</p>
                <a href="tel:0916666779" style={{ display: 'block', background: 'var(--accent)', color: '#fff', padding: '8px 12px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>
                  📞 0916 666 779
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
