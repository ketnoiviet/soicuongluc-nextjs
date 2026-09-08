import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giới thiệu Công ty HARIFA | soicuongluc.com',
  description: 'HARIFA - Công ty TNHH SXTMDV HARIFA, nhà phân phối sợi cường lực chính hãng uy tín tại Việt Nam',
}

export default function GioiThieuPage() {
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

      {/* GIỚI THIỆU CÔNG TY */}
      <section className="page-section">
        <div className="container">
          <div className="section-title">
            <h2>Về Công ty HARIFA</h2>
            <p>Nhà phân phối sợi cường lực chính hãng tại Việt Nam</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden' }}>
                <Image 
                  src="/uploads/hinhanh/about-company.jpg" 
                  alt="Công ty HARIFA" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)', marginBottom: 14 }}>
                CÔNG TY TNHH SXTMDV HARIFA
              </h3>
              <div className="rich-content">
                <p>HARIFA là đơn vị phân phối chính hãng các loại sợi cường lực cao cấp từ các thương hiệu hàng đầu thế giới như <strong>Hyosung (Hàn Quốc)</strong>, <strong>Kolon (Hàn Quốc)</strong>, <strong>Toray (Nhật Bản)</strong>.</p>
                <p>Với hơn 10 năm kinh nghiệm trong ngành, HARIFA tự hào cung cấp đa dạng các loại sợi kỹ thuật cao phục vụ các ngành công nghiệp dệt may, săm lốp, vật liệu gia cố và nhiều ứng dụng công nghiệp khác.</p>
                <p>Hệ thống kho hàng đặt tại TP. Hồ Chí Minh, Hà Nội và Đà Nẵng giúp HARIFA phục vụ khách hàng nhanh chóng, kịp thời trên toàn quốc.</p>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                <a href="tel:0916666779" className="btn-detail" style={{ background: 'var(--accent)', padding: '10px 20px' }}>
                  📞 Liên hệ ngay
                </a>
                <Link href="/dat-hang" className="btn-detail" style={{ padding: '10px 20px' }}>
                  📋 Báo giá
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ĐẶC TÍNH SỢI CƯỜNG LỰC */}
      <section id="dac-tinh" className="page-section bg-light">
        <div className="container">
          <div className="section-title">
            <h2>Đặc tính sợi cường lực</h2>
            <p>Các thông số kỹ thuật nổi bật của sợi cường lực HARIFA</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { icon: '💪', title: 'Độ bền kéo cao', desc: 'Tenacity đạt 6–9 g/denier, vượt trội so với sợi thông thường' },
              { icon: '🔥', title: 'Chịu nhiệt tốt', desc: 'Ổn định cấu trúc ở nhiệt độ cao, phù hợp quy trình công nghiệp' },
              { icon: '⚗️', title: 'Chống hóa chất', desc: 'Kháng axit, kiềm và nhiều hóa chất công nghiệp phổ biến' },
              { icon: '🪶', title: 'Trọng lượng nhẹ', desc: 'Tỷ lệ độ bền/trọng lượng vượt trội so với kim loại truyền thống' },
              { icon: '📐', title: 'Độ co ngót thấp', desc: 'Shrinkage thấp giúp sản phẩm ổn định kích thước trong quá trình gia công' },
              { icon: '🔗', title: 'Kết dính tốt', desc: 'Tương thích cao với cao su và nhựa trong ứng dụng gia cố' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 10, padding: '20px 16px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-gray)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ỨNG DỤNG */}
      <section id="ung-dung" className="page-section">
        <div className="container">
          <div className="section-title">
            <h2>Ứng dụng của sợi cường lực</h2>
            <p>Sợi cường lực HARIFA được sử dụng rộng rãi trong nhiều ngành công nghiệp</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { title: 'Công nghiệp lốp xe & Ô tô', icon: '🚗', items: ['Tire cord (dây cốt lốp)', 'Bead wire (dây tanh)', 'Airbag fabric', 'Belt và hose ô tô'] },
              { title: 'Dệt may & Vải kỹ thuật', icon: '🧵', items: ['Vải dù bảo hộ', 'Dây đai công nghiệp', 'Vải địa kỹ thuật', 'Lưới an toàn'] },
              { title: 'Composite & Vật liệu mới', icon: '🏗️', items: ['Gia cố nhựa composite', 'Thanh FRP xây dựng', 'Vỏ tàu thuyền', 'Cánh tuabin gió'] },
              { title: 'Hàng không & Công nghiệp nặng', icon: '✈️', items: ['Cáp cẩu & neo', 'Dây an toàn leo núi', 'Cáp băng tải', 'Vải lọc công nghiệp'] },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ background: 'var(--primary)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>{item.title}</h3>
                </div>
                <ul style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {item.items.map((li, j) => (
                    <li key={j} style={{ fontSize: 13, color: 'var(--text-gray)' }}>✓ {li}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HỆ THỐNG VĂN PHÒNG */}
      <section className="page-section bg-light">
        <div className="container">
          <div className="section-title">
            <h2>Hệ thống văn phòng & Kho hàng</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { city: 'TP. Hồ Chí Minh', type: 'Văn phòng & Kho', address: '154 Phạm Phú Thứ, P. Bảy Hiền, TP.HCM', phone: '0916 666 779', icon: '🏢' },
              { city: 'Hà Nội', type: 'Văn phòng', address: '96 Lô F4, KĐT Đại Kim - Định Công, P. Định Công, HN', phone: '0909 829 439', icon: '🏢' },
              { city: 'Đà Nẵng', type: 'Văn phòng', address: '06 Thái Thị Bôi, Xã Nam Phước, TP. Đà Nẵng', phone: '0916 666 779', icon: '🏢' },
              { city: 'Tổng kho', type: 'Kho hàng chính', address: '27/71 Xuân Thới Thượng 59, Ấp 7, Xã Bà Điểm, TP.HCM', phone: '0916 666 779', icon: '📦' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 10, padding: '20px 16px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 2 }}>{item.city}</h3>
                <span style={{ fontSize: 11, background: 'rgba(26,82,118,0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 3, fontWeight: 600 }}>{item.type}</span>
                <p style={{ fontSize: 13, color: 'var(--text-gray)', marginTop: 10, lineHeight: 1.6 }}>📍 {item.address}</p>
                <a href={`tel:${item.phone.replace(/\s/g, '')}`} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>📞 {item.phone}</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}