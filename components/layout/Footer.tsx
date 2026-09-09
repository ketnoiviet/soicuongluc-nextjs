import Link from 'next/link'
import Image from 'next/image'
import type { CompanyInfo } from '@/lib/company-info'

type Category = { name: string; slug: string }

export default function Footer({
  companyInfo,
  categories = [],
}: {
  companyInfo: CompanyInfo
  categories?: Category[]
}) {
  const offices = [
    { label: 'HCM', value: companyInfo.addressHcm },
    { label: 'HN', value: companyInfo.addressHn },
    { label: 'ĐN', value: companyInfo.addressDn },
  ].filter((o) => o.value)

  const year = new Date().getFullYear()

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {/* Cột 1: Thông tin công ty */}
            <div>
              <Image src="/uploads/hinhanh/Untitled_1.png" alt={companyInfo.companyName || 'Logo'} width={160} height={44}
                style={{ height: 44, width: 'auto', objectFit: 'contain', marginBottom: 12, filter: 'brightness(0) invert(1)' }} />
              {companyInfo.companyName && (
                <p style={{ marginTop: 8 }}>
                  <strong>{companyInfo.companyName}</strong>
                </p>
              )}
              {companyInfo.tagline && <p>{companyInfo.tagline}</p>}
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                {companyInfo.facebook && (
                  <a href={companyInfo.facebook} target="_blank" rel="noopener"
                    style={{ background: '#3b5998', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>
                    Facebook
                  </a>
                )}
                {companyInfo.zalo && (
                  <a href={`https://zalo.me/${companyInfo.zalo}`} target="_blank" rel="noopener"
                    style={{ background: '#0068ff', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>
                    Zalo
                  </a>
                )}
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
            {categories.length > 0 && (
              <div>
                <h4>Sản phẩm</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {categories.map(item => (
                    <li key={item.slug}>
                      <Link href={`/san-pham/${item.slug}`}>▸ {item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cột 4: Liên hệ */}
            <div>
              <h4>Liên hệ</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {offices.map((o) => (
                  <li key={o.label}>🏢 VP {o.label}: {o.value}</li>
                ))}
                {companyInfo.addressWarehouse && <li>📦 Kho: {companyInfo.addressWarehouse}</li>}
                {(companyInfo.phone || companyInfo.phone2) && (
                  <li>
                    📞{' '}
                    {companyInfo.phone && <a href={`tel:${companyInfo.phone}`}>{companyInfo.phone}</a>}
                    {companyInfo.phone && companyInfo.phone2 && ' - '}
                    {companyInfo.phone2 && <a href={`tel:${companyInfo.phone2}`}>{companyInfo.phone2}</a>}
                  </li>
                )}
                {companyInfo.email && <li>✉️ <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a></li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          Copyright © {year}{companyInfo.companyName ? ` - ${companyInfo.companyName}` : ''}
        </div>
      </footer>

      {/* STICKY CONTACT BAR (mobile) */}
      {(companyInfo.phone || companyInfo.zalo || companyInfo.messenger) && (
        <div className="contact-sticky" style={{ display: 'flex' }}>
          {companyInfo.phone && <a href={`tel:${companyInfo.phone}`}>📞 Gọi điện</a>}
          {companyInfo.phone && <a href={`sms:${companyInfo.phone}`}>💬 SMS</a>}
          {companyInfo.zalo && <a href={`https://zalo.me/${companyInfo.zalo}`} target="_blank" rel="noopener">🔵 Zalo</a>}
          {companyInfo.messenger && <a href={companyInfo.messenger} target="_blank" rel="noopener">💬 Messenger</a>}
        </div>
      )}
    </>
  )
}
