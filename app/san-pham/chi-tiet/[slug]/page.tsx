import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.sanPham.findFirst({ where: { link: params.slug } })
  if (!product) return { title: 'Sản phẩm không tồn tại' }
  return {
    title: `${product.tenSP} | HARIFA - soicuongluc.com`,
    description: product.tomTat || `${product.tenSP} - Sợi cường lực chính hãng tại HARIFA`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.sanPham.findFirst({
    where: { link: params.slug, hieuLuc: 1 },
    include: { loai: true, hinhAnhs: { orderBy: { thuTu: 'asc' } } },
  })
  if (!product) notFound()

  // Sản phẩm liên quan cùng danh mục
  const related = await prisma.sanPham.findMany({
    where: { idLoai: product.idLoai, hieuLuc: 1, id: { not: product.id } },
    take: 4, orderBy: { thuTu: 'asc' },
  })

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <ol>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/san-pham">Sản phẩm</Link></li>
            {product.loai && (
              <li><Link href={`/san-pham/${product.loai.url}`}>{product.loai.tenLoai}</Link></li>
            )}
            <li>{product.tenSP}</li>
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
                  src={getImageUrl(product.hinhLon || product.hinhNho)}
                  alt={product.tenSP || ''}
                  fill style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
              {/* Ảnh phụ */}
              {product.hinhAnhs.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {product.hinhAnhs.map(h => (
                    <div key={h.id} style={{ width: 80, height: 60, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                      <Image src={getImageUrl(h.url)} alt="" fill style={{ objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Thông tin */}
            <div>
              {product.loai && (
                <Link href={`/san-pham/${product.loai.url}`} style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginBottom: 8, display: 'block' }}>
                  📦 {product.loai.tenLoai}
                </Link>
              )}
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.3, marginBottom: 14 }}>
                {product.tenSP}
              </h1>

              {product.tomTat && (
                <div className="rich-content" style={{ marginBottom: 20, padding: '14px 16px', background: 'var(--bg-light)', borderRadius: 8, borderLeft: '4px solid var(--primary)' }}
                  dangerouslySetInnerHTML={{ __html: product.tomTat }} />
              )}

              {/* Thông số nhanh */}
              {(product.chieuRong || product.duongKinh || product.trongLuong) && (
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>Thông số kỹ thuật</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <tbody>
                      {product.chieuRong && <tr><td style={{ padding: '6px 10px', background: 'var(--bg-light)', fontWeight: 600, border: '1px solid var(--border)', width: '40%' }}>Chiều rộng</td><td style={{ padding: '6px 10px', border: '1px solid var(--border)' }}>{product.chieuRong}</td></tr>}
                      {product.chieuDai && <tr><td style={{ padding: '6px 10px', background: 'var(--bg-light)', fontWeight: 600, border: '1px solid var(--border)' }}>Chiều dài</td><td style={{ padding: '6px 10px', border: '1px solid var(--border)' }}>{product.chieuDai}</td></tr>}
                      {product.duongKinh && <tr><td style={{ padding: '6px 10px', background: 'var(--bg-light)', fontWeight: 600, border: '1px solid var(--border)' }}>Đường kính</td><td style={{ padding: '6px 10px', border: '1px solid var(--border)' }}>{product.duongKinh}</td></tr>}
                      {product.trongLuong && <tr><td style={{ padding: '6px 10px', background: 'var(--bg-light)', fontWeight: 600, border: '1px solid var(--border)' }}>Trọng lượng</td><td style={{ padding: '6px 10px', border: '1px solid var(--border)' }}>{product.trongLuong}</td></tr>}
                    </tbody>
                  </table>
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
          {(product.noiDung || product.thongSo || product.ungDung) && (
            <div style={{ marginTop: 48 }}>
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: 24, gap: 0, flexWrap: 'wrap' }}>
                {[
                  { label: 'Tổng quan', show: !!product.noiDung },
                  { label: 'Thông số kỹ thuật', show: !!product.thongSo },
                  { label: 'Ứng dụng', show: !!product.ungDung },
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
                dangerouslySetInnerHTML={{ __html: product.noiDung || '' }} />
              {product.thongSo && (
                <div className="rich-content" style={{ marginTop: 20 }}
                  dangerouslySetInnerHTML={{ __html: product.thongSo }} />
              )}
              {product.ungDung && (
                <div className="rich-content" style={{ marginTop: 20 }}
                  dangerouslySetInnerHTML={{ __html: product.ungDung }} />
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
                  <Link key={p.id} href={`/san-pham/chi-tiet/${p.link || p.id}`} className="product-card">
                    <div className="product-card-img">
                      <Image src={getImageUrl(p.hinhNho)} alt={p.tenSP || ''} fill sizes="25vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-title">{p.tenSP}</div>
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
