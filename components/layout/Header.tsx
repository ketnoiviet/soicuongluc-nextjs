'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const sanPhamMenu = [
  { href: '/san-pham/soi-polyester-cuong-luc', label: 'Sợi polyester cường lực' },
  { href: '/san-pham/soi-nylon-cuong-luc', label: 'Sợi nylon cường lực' },
  { href: '/san-pham/soi-carbon', label: 'Sợi carbon' },
  { href: '/san-pham/lop-xe-vat-lieu-gia-co-cong-nghiep-pu', label: 'Lốp xe & vật liệu gia cố PU' },
]

export default function Header({
  introArticles = [],
  logoUrl,
}: {
  introArticles?: { title: string; slug: string }[]
  logoUrl?: string | null
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [spOpen, setSpOpen] = useState(false)

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>📞 <a href="tel:0916666779">0916 666 779</a></span>
            <span>✉️ <a href="mailto:sales@harifavn.com">sales@harifavn.com</a></span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="https://www.facebook.com/thegioisoidet" target="_blank" rel="noopener" aria-label="Facebook">Facebook</a>
            <a href="https://zalo.me/0916666779" target="_blank" rel="noopener" aria-label="Zalo">Zalo</a>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="header">
        <div className="container">
          <div className="header-inner" style={{ position: 'relative' }}>
            {/* Logo */}
            <Link href="/" className="logo">
              <Image
                src={logoUrl || '/uploads/hinhanh/Untitled_1.png'}
                alt="HARIFA - Sợi cường lực"
                width={200}
                height={56}
                style={{ height: 56, width: 'auto', objectFit: 'contain' }}
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className={`nav${menuOpen ? ' open' : ''}`}>
              <div className="nav-item">
                <Link href="/" className="nav-link">Trang chủ</Link>
              </div>
              <div className="nav-item">
                <Link href="/gioi-thieu" className="nav-link">
                  Giới thiệu{introArticles.length > 0 ? ' ▾' : ''}
                </Link>
                {introArticles.length > 0 && (
                  <div className="dropdown">
                    {introArticles.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/gioi-thieu/${item.slug}`}
                        className="dropdown-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="nav-item">
                <span className="nav-link" style={{ cursor: 'pointer' }}
                  onClick={() => setSpOpen(!spOpen)}>
                  Sợi cường lực ▾
                </span>
                <div className="dropdown">
                  {sanPhamMenu.map(item => (
                    <Link key={item.href} href={item.href} className="dropdown-link"
                      onClick={() => setMenuOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="nav-item">
                <Link href="/tin-tuc" className="nav-link">Tin tức</Link>
              </div>
              <div className="nav-item">
                <Link href="/lien-he" className="nav-link">Liên hệ</Link>
              </div>
              <div className="nav-item">
                <Link href="/dat-hang" className="nav-link"
                  style={{ background: 'var(--accent)', color: '#fff', borderRadius: 6, padding: '8px 16px' }}>
                  Nhận báo giá
                </Link>
              </div>
            </nav>

            {/* Mobile toggle */}
            <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
