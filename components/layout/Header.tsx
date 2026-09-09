'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { CompanyInfo } from '@/lib/company-info'

type Category = { name: string; slug: string }

export default function Header({
  introArticles = [],
  logoUrl,
  companyInfo,
  categories = [],
}: {
  introArticles?: { title: string; slug: string }[]
  logoUrl?: string | null
  companyInfo: CompanyInfo
  categories?: Category[]
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [spOpen, setSpOpen] = useState(false)

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {companyInfo.phone && (
              <span>📞 <a href={`tel:${companyInfo.phone}`}>{companyInfo.phone}</a></span>
            )}
            {companyInfo.email && (
              <span>✉️ <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a></span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {companyInfo.facebook && (
              <a href={companyInfo.facebook} target="_blank" rel="noopener" aria-label="Facebook">Facebook</a>
            )}
            {companyInfo.zalo && (
              <a href={`https://zalo.me/${companyInfo.zalo}`} target="_blank" rel="noopener" aria-label="Zalo">Zalo</a>
            )}
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
                alt={companyInfo.companyName || 'Logo'}
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
              {categories.length > 0 && (
                <div className="nav-item">
                  <span className="nav-link" style={{ cursor: 'pointer' }}
                    onClick={() => setSpOpen(!spOpen)}>
                    Sản phẩm ▾
                  </span>
                  <div className="dropdown">
                    {categories.map((item) => (
                      <Link key={item.slug} href={`/san-pham/${item.slug}`} className="dropdown-link"
                        onClick={() => setMenuOpen(false)}>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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
