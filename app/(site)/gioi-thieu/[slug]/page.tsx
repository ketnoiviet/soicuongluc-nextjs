import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const article = await prisma.aboutArticle.findFirst({ where: { slug: params.slug } })
  if (!article) return { title: 'Bài viết không tồn tại' }
  return { title: `${article.title} | HARIFA` }
}

export default async function GioiThieuDetailPage(props: Props) {
  const params = await props.params;
  const [article, others] = await Promise.all([
    prisma.aboutArticle.findFirst({ where: { slug: params.slug, status: 'PUBLISHED' } }),
    prisma.aboutArticle.findMany({ where: { status: 'PUBLISHED' }, orderBy: { sortOrder: 'asc' } }),
  ])
  if (!article) notFound()

  return (
    <>
      <div className="breadcrumb">
        <div className="container">
          <ol>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/gioi-thieu">Giới thiệu</Link></li>
            <li style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</li>
          </ol>
        </div>
      </div>

      <section className="page-section">
        <div className="container">
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <article style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.3, marginBottom: 20 }}>
                {article.title}
              </h1>

              {article.thumbnailUrl && (
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
                  <Image src={getImageUrl(article.thumbnailUrl)} alt={article.title} fill style={{ objectFit: 'cover' }} priority />
                </div>
              )}

              <div className="rich-content" dangerouslySetInnerHTML={{ __html: article.contentHtml || '' }} />
            </article>

            <aside style={{ width: 260, flexShrink: 0 }}>
              <div style={{ background: 'var(--primary)', color: '#fff', padding: '10px 14px', borderRadius: '8px 8px 0 0', fontWeight: 700, fontSize: 13 }}>
                Giới thiệu
              </div>
              <ul style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                {others.map((o) => (
                  <li key={o.id} style={{ borderBottom: '1px solid var(--bg-gray)' }}>
                    <Link
                      href={`/gioi-thieu/${o.slug}`}
                      style={{
                        display: 'block',
                        padding: '10px 16px',
                        fontSize: 13,
                        color: o.slug === article.slug ? 'var(--primary)' : 'var(--text-dark)',
                        fontWeight: o.slug === article.slug ? 700 : 400,
                      }}
                    >
                      {o.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
