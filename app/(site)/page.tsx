import { prisma } from '@/lib/prisma'
import HeroSlider from '@/components/ui/HeroSlider'
import { ProductCard, NewsCard } from '@/components/ui/Cards'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import type { ProductCategory, Product, NewsArticle } from '@prisma/client'

export default async function HomePage() {
  // Fetch dữ liệu song song
  const [banners, categories, featuredProducts, latestNews] = await Promise.all([
    prisma.bannerSlide.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.productCategory.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      orderBy: { sortOrder: 'asc' },
      take: 8,
    }),
    prisma.newsArticle.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    }),
  ])

  return (
    <>
      {/* HERO SLIDER */}
      <HeroSlider slides={banners} />

      {/* DANH MỤC SẢN PHẨM */}
      <section className="page-section bg-light">
        <div className="container">
          <div className="section-title">
            <h2>Danh mục sản phẩm</h2>
            <p>Nhà phân phối sợi cường lực chính hãng Hyosung, Kolon, Toray tại Việt Nam</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {categories.map((cat: ProductCategory) => (
              <Link key={cat.id} href={`/san-pham/${cat.slug || cat.id}`}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
                className="product-card">
                <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--bg-light)' }}>
                  <Image
                    src={getImageUrl(cat.imageUrl)}
                    alt={cat.name || ''}
                    fill sizes="25vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                    {cat.name}
                  </h3>
                  <span style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6, display: 'block', fontWeight: 600 }}>
                    Xem sản phẩm →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SẢN PHẨM NỔI BẬT */}
      <section className="page-section">
        <div className="container">
          <div className="section-title">
            <h2>Sản phẩm nổi bật</h2>
            <p>Các sản phẩm sợi cường lực chất lượng cao được khách hàng tin dùng</p>
          </div>
          <div className="products-grid">
            {featuredProducts.map((p: Product) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/san-pham" className="btn-detail" style={{ fontSize: 14, padding: '10px 28px' }}>
              Xem tất cả sản phẩm →
            </Link>
          </div>
        </div>
      </section>

      {/* LÝ DO CHỌN HARIFA */}
      <section className="page-section bg-light">
        <div className="container">
          <div className="section-title">
            <h2>Tại sao chọn HARIFA?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { icon: '🏆', title: 'Chính hãng 100%', desc: 'Đại lý phân phối ủy quyền từ Hyosung, Kolon, Toray – các thương hiệu hàng đầu thế giới' },
              { icon: '🚚', title: 'Giao hàng toàn quốc', desc: 'Kho hàng tại TP.HCM, Hà Nội, Đà Nẵng – giao hàng nhanh trên toàn quốc' },
              { icon: '💬', title: 'Tư vấn chuyên sâu', desc: 'Đội ngũ kỹ thuật giàu kinh nghiệm, hỗ trợ chọn đúng loại sợi cho từng ứng dụng' },
              { icon: '✅', title: 'Cam kết chất lượng', desc: 'Sản phẩm có chứng nhận chất lượng quốc tế, bảo hành rõ ràng, đổi trả minh bạch' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 10, padding: '24px 20px',
                textAlign: 'center', border: '1px solid var(--border)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THỐNG KÊ */}
      <section style={{ background: 'var(--primary)', padding: '48px 0' }}>
        <div className="container">
          <div className="stats-grid">
            {[
              { number: '10+', label: 'Năm kinh nghiệm' },
              { number: '500+', label: 'Khách hàng tin dùng' },
              { number: '50+', label: 'Loại sợi cường lực' },
              { number: '3', label: 'Văn phòng toàn quốc' },
            ].map((s, i) => (
              <div key={i} className="stat-item" style={{ color: '#fff', textAlign: 'center' }}>
                <div className="number" style={{ fontSize: 40, fontWeight: 800, color: '#ffd740' }}>{s.number}</div>
                <div className="label" style={{ color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIN TỨC MỚI NHẤT */}
      {latestNews.length > 0 && (
        <section className="page-section">
          <div className="container">
            <div className="section-title">
              <h2>Tin tức & Kiến thức</h2>
              <p>Cập nhật thông tin mới nhất về ngành sợi cường lực</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {latestNews.map((a: NewsArticle) => <NewsCard key={a.id} article={a} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <Link href="/tin-tuc" className="btn-detail" style={{ fontSize: 14, padding: '10px 28px' }}>
                Xem tất cả tin tức →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* LIÊN HỆ NHANH */}
      <section className="page-section bg-light">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)', marginBottom: 12 }}>
            Cần tư vấn hoặc báo giá?
          </h2>
          <p style={{ color: 'var(--text-gray)', marginBottom: 24 }}>
            Liên hệ ngay với HARIFA để được tư vấn miễn phí và nhận báo giá tốt nhất
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:0916666779" className="btn-detail" style={{ fontSize: 14, padding: '12px 28px', background: 'var(--accent)' }}>
              📞 Gọi ngay: 0916 666 779
            </a>
            <Link href="/dat-hang" className="btn-detail" style={{ fontSize: 14, padding: '12px 28px' }}>
              📋 Gửi yêu cầu báo giá
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
