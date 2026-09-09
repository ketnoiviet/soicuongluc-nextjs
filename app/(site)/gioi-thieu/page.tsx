import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/utils'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/site-name'

export const metadata: Metadata = {
  title: `Giới thiệu | ${SITE_NAME}`,
}

export default async function GioiThieuPage() {
  const articles = await prisma.aboutArticle.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <>
      <div className="breadcrumb">
        <div className="container">
          <ol>
            <li><Link href="/">Trang chủ</Link></li>
            <li>Giới thiệu</li>
          </ol>
        </div>
      </div>

      <section className="page-section">
        <div className="container">
          <div className="section-title">
            <h2>Giới thiệu {SITE_NAME}</h2>
          </div>

          {articles.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: 40 }}>Chưa có bài viết giới thiệu nào.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
              {articles.map((a) => (
                <Link
                  key={a.id}
                  href={`/gioi-thieu/${a.slug}`}
                  style={{ display: 'block', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: '#fff' }}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: 'var(--bg-light)' }}>
                    <Image src={getImageUrl(a.thumbnailUrl)} alt={a.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>{a.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
