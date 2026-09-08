import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findFirst({ where: { slug: params.slug } })
  if (!product) return { title: 'Sản phẩm không tồn tại' }
  return {
    title: `${product.name} | HARIFA - soicuongluc.com`,
    description: product.shortDescription || `${product.name} - Sợi cường lực chính hãng tại HARIFA`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.product.findFirst({
    where: { slug: params.slug, status: 'PUBLISHED' },
    include: { category: true, images: { orderBy: { sortOrder: 'asc' } }, dimensions: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!product) notFound()

  // Sản phẩm liên quan cùng danh mục
  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, status: 'PUBLISHED', id: { not: product.id } },
    take: 4, orderBy: { sortOrder: 'asc' },
  })

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <ol>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/san-pham">Sản phẩm</Link></li>
            {product.category && (
              <li><Link href={`/san-pham/${product.category.slug}`}>{product.category.name}</Link></li>
            )}
            <li>{product.name}</li>
          </ol>
        </div>
      </div>

      <section className="page-section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>

            {/* Hình ảnh */}
            <div>
              <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <Image
                  src={getImageUrl(product.coverImageUrl || product.thumbnailUrl)}
                  alt={product.name || ''}
                  fill style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
              {/* Ảnh phụ */}
              {product.images.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {product.images.map((h) => (
                    <div key={h.id} style={{ width: 80, height: 60, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                      <Image src={getImageUrl(h.imageUrl)} alt="" fill style={{ objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Thông tin */}
            <div>
              {product.category && (
                <Link href={`/san-pham/${product.category.slug}`} style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginBottom: 8, display: 'block' }}>
                  📦 {product.category.name}
                </Link>
              )}
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.3, marginBottom: 14 }}>
                {product.name}
              </h1>

              {product.shortDescription && (
                <div className="rich-content" style={{ marginBottom: 20, padding: '14px 16px', background: 'var(--bg-light)', borderRadius: 8, borderLeft: '4px solid var(--primary)' }}
                  dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
              )}

              {/* Kích thước / quy cách */}
              {product.dimensions.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>Kích thước / quy cách</h3>
                  <ul style={{ fontSize: 13, listStyle: 'disc', paddingLeft: 20 }}>
                    {product.dimensions.map((d) => (
                      <li key={d.id} style={{ marginBottom: 4 }}>{d.value}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nút hành động */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
                <a href="tel:0916666779" className="btn-detail" style={{ background: 'var(--accent)', fontSize: 14, padding: '12px 22px' }}>
                  📞 Gọi báo giá ngay
                </a>
                <Link href="/dat-hang" className="btn-detail" style={{ fontSize: 14, padding: '12px 22px' }}>
                  📋 Gửi yêu cầu báo giá
                </Link>
                <a href={`https://zalo.me/0916666779`} target="_blank" rel="noopener" className="btn-detail"
                  style={{ background: '#0068ff', fontSize: 14, padding: '12px 22px' }}>
                  🔵 Chat Zalo
                </a>
              </div>
            </div>
          </div>

          {/* Nội dung chi tiết */}
          {(product.descriptionHtml || product.specificationsHtml || product.applicationsHtml) && (
            <div style={{ marginTop: 48 }}>
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: 24, gap: 0, flexWrap: 'wrap' }}>
                {[
                  { label: 'Tổng quan', show: !!product.descriptionHtml },
                  { label: 'Thông số kỹ thuật', show: !!product.specificationsHtml },
                  { label: 'Ứng dụng', show: !!product.applicationsHtml },
                ].filter(t => t.show).map((tab, i) => (
                  <div key={i} style={{
                    padding: '10px 20px', fontSize: 14, fontWeight: 600,
                    background: i === 0 ? 'var(--primary)' : 'transparent',
                    color: i === 0 ? '#fff' : 'var(--text-gray)',
                    borderRadius: '6px 6px 0 0', cursor: 'pointer',
                  }}>{tab.label}</div>
                ))}
              </div>
              <div className="rich-content"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '' }} />
              {product.specificationsHtml && (
                <div className="rich-content" style={{ marginTop: 20 }}
                  dangerouslySetInnerHTML={{ __html: product.specificationsHtml }} />
              )}
              {product.applicationsHtml && (
                <div className="rich-content" style={{ marginTop: 20 }}
                  dangerouslySetInnerHTML={{ __html: product.applicationsHtml }} />
              )}
            </div>
          )}

          {/* Sản phẩm liên quan */}
          {related.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)', marginBottom: 20, paddingBottom: 8, borderBottom: '2px solid var(--border)' }}>
                Sản phẩm liên quan
              </h2>
              <div className="products-grid">
                {related.map(p => (
                  <Link key={p.id} href={`/san-pham/chi-tiet/${p.slug || p.id}`} className="product-card">
                    <div className="product-card-img">
                      <Image src={getImageUrl(p.thumbnailUrl)} alt={p.name || ''} fill sizes="25vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-title">{p.name}</div>
                      <span className="btn-detail">Xem chi tiết →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
