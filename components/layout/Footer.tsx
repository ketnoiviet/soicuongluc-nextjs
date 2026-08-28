import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {/* Cột 1: Thông tin công ty */}
            <div>
              <Image src="/uploads/hinhanh/Untitled_1.png" alt="HARIFA" width={160} height={44}
                style={{ height: 44, width: 'auto', objectFit: 'contain', marginBottom: 12, filter: 'brightness(0) invert(1)' }} />
              <p style={{ marginTop: 8 }}>
                <strong>CÔNG TY TNHH SXTMDV HARIFA</strong>
              </p>
              <p>Nhà phân phối sợi cường lực chính hãng, uy tín và chất lượng.</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <a href="https://www.facebook.com/thegioisoidet" target="_blank" rel="noopener"
                  style={{ background: '#3b5998', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>
                  Facebook
                </a>
                <a href="https://zalo.me/0916666779" target="_blank" rel="noopener"
                  style={{ background: '#0068ff', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>
                  Zalo
                </a>
              </div>
            </div>

            {/* Cột 2: Menu */}
            <div>
              <h4>Menu</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { href: '/', label: 'Trang chủ' },
                  { href: '/gioi-thieu', label: 'Giới thiệu' },
                  { href: '/tin-tuc', label: 'Tin tức' },
                  { href: '/lien-he', label: 'Liên hệ' },
                  { href: '/dat-hang', label: 'Nhận báo giá' },
                ].map(item => (
                  <li key={item.href}>
                    <Link href={item.href}>▸ {item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cột 3: Sản phẩm */}
            <div>
              <h4>Sản phẩm</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { href: '/san-pham/soi-polyester-cuong-luc', label: 'Sợi polyester cường lực' },
                  { href: '/san-pham/soi-nylon-cuong-luc', label: 'Sợi nylon cường lực' },
                  { href: '/san-pham/soi-carbon', label: 'Sợi carbon' },
                  { href: '/san-pham/lop-xe-vat-lieu-gia-co-cong-nghiep-pu', label: 'Lốp xe & vật liệu gia cố PU' },
                ].map(item => (
                  <li key={item.href}>
                    <Link href={item.href}>▸ {item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cột 4: Liên hệ */}
            <div>
              <h4>Liên hệ</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>🏢 VP HCM: 154 Phạm Phú Thứ, P. Bảy Hiền, TPHCM</li>
                <li>🏢 VP HN: 96 Lô F4, KĐT Đại Kim - Định Công, HN</li>
                <li>🏢 VP ĐN: 06 Thái Thị Bôi, Xã Nam Phước, ĐN</li>
                <li>📦 Kho: 27/71 Xuân Thới Thượng 59, Bà Điểm, TPHCM</li>
                <li>📞 <a href="tel:0916666779">0916 666 779</a> - <a href="tel:0909829439">0909 829 439</a></li>
                <li>✉️ <a href="mailto:info@harifavn.com">info@harifavn.com</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          Copyright © 2025 HARIFA - soicuongluc.com | Thiết kế bởi HARIFA Team
        </div>
      </footer>

      {/* STICKY CONTACT BAR (mobile) */}
      <div className="contact-sticky" style={{ display: 'flex' }}>
        <a href="tel:0916666779">📞 Gọi điện</a>
        <a href="sms:0916666779">💬 SMS</a>
        <a href="https://zalo.me/0916666779" target="_blank" rel="noopener">🔵 Zalo</a>
        <a href="https://www.messenger.com/t/thegioisoidet" target="_blank" rel="noopener">💬 Messenger</a>
      </div>
    </>
  )
}
