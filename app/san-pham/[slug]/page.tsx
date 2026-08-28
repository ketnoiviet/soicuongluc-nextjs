import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ui/Cards'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await prisma.sanPhamLoai.findFirst({ where: { url: params.slug } })
  if (!cat) return { title: 'Sản phẩm không tồn tại' }
  return {
    title: `${cat.tenLoai} | HARIFA - soicuongluc.com`,
    description: cat.tomTat || `Danh sách sản phẩm ${cat.tenLoai} chính hãng tại HARIFA`,
  }
}

export async function generateStaticParams() {
  const cats = await prisma.sanPhamLoai.findMany({ where: { hieuLuc: 1 }, select: { url: true } })
  return cats.filter(c => c.url).map(c => ({ slug: c.url! }))
}

export default async function SanPhamCategoryPage({ params }: Props) {
  const [category, allCategories] = await Promise.all([
    prisma.sanPhamLoai.findFirst({ where: { url: params.slug, hieuLuc: 1 } }),
    prisma.sanPhamLoai.findMany({ where: { hieuLuc: 1 }, orderBy: { thuTu: 'asc' } }),
  ])

  if (!category) notFound()

  const products = await prisma.sanPham.findMany({
    where: { idLoai: category.id, hieuLuc: 1, hienThi: 1 },
    orderBy: { thuTu: 'asc' },
  })

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <ol>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/san-pham">Sản phẩm</Link></li>
            <li>{category.tenLoai}</li>
          </ol>
        </div>
      </div>

      <section className="page-section">
        <div className="container">
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Sidebar: Danh mục */}
            <aside style={{ width: 220, flexShrink: 0 }}>
              <div style={{ background: 'var(--primary)', color: '#fff', padding: '12px 16px', borderRadius: '8px 8px 0 0', fontWeight: 700, fontSize: 14 }}>
                📦 Danh mục sản phẩm
              </div>
              <ul style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                {allCategories.map(cat => (
                  <li key={cat.id}>
                    <Link href={`/san-pham/${cat.url}`} style={{
                      display: 'block', padding: '10px 16px', fontSize: 13,
                      borderBottom: '1px solid var(--bg-gray)',
                      background: cat.id === category.id ? 'rgba(26,82,118,0.08)' : '#fff',
                      color: cat.id === category.id ? 'var(--primary)' : 'var(--text-dark)',
                      fontWeight: cat.id === category.id ? 700 : 400,
                    }}>
                      {cat.id === category.id ? '▸ ' : ''}{cat.tenLoai}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* CTA box */}
              <div style={{
                marginTop: 16, background: 'var(--primary)', color: '#fff',
                padding: 16, borderRadius: 8, textAlign: 'center',
              }}>
                <p style={{ fontSize: 13, marginBottom: 10, color: 'rgba(255,255,255,0.9)' }}>
                  Cần tư vấn chọn sợi phù hợp?
                </p>
                <a href="tel:0916666779" style={{
                  display: 'block', background: 'var(--accent)', color: '#fff',
                  padding: '8px 12px', borderRadius: 6, fontSize: 13, fontWeight: 700, marginBottom: 6,
                }}>📞 0916 666 779</a>
                <Link href="/dat-hang" style={{
                  display: 'block', background: '#fff', color: 'var(--primary)',
                  padding: '8px 12px', borderRadius: 6, fontSize: 13, fontWeight: 700,
                }}>📋 Gửi yêu cầu</Link>
              </div>
            </aside>

            {/* Main: Products */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                {category.tenLoai}
              </h1>
              {category.tomTat && (
                <p style={{ color: 'var(--text-gray)', marginBottom: 20, fontSize: 14, lineHeight: 1.7 }}>
                  {category.tomTat}
                </p>
              )}
              <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 20 }}>
                Hiển thị <strong>{products.length}</strong> sản phẩm
              </p>

              {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-light)' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                  <p>Chưa có sản phẩm trong danh mục này.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
