import Link from 'next/link'
import { getCompanyInfo } from '@/lib/company-info'
import { SITE_NAME } from '@/lib/site-name'
import LienHeForm from './LienHeForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: `Liên hệ | ${SITE_NAME}` }

export default async function LienHePage() {
  const companyInfo = await getCompanyInfo()

  const phones = [companyInfo.phone, companyInfo.phone2].filter(Boolean).join(' – ')

  const items = [
    companyInfo.addressHcm && { icon: '🏢', title: 'Văn phòng TP.HCM', content: companyInfo.addressHcm },
    companyInfo.addressHn && { icon: '🏢', title: 'Văn phòng Hà Nội', content: companyInfo.addressHn },
    companyInfo.addressDn && { icon: '🏢', title: 'Văn phòng Đà Nẵng', content: companyInfo.addressDn },
    companyInfo.addressWarehouse && { icon: '📦', title: 'Tổng kho', content: companyInfo.addressWarehouse },
    phones && { icon: '📞', title: 'Điện thoại / Zalo', content: phones },
    companyInfo.email && { icon: '✉️', title: 'Email', content: companyInfo.email },
    companyInfo.workingHours && { icon: '🕘', title: 'Giờ làm việc', content: companyInfo.workingHours },
  ].filter(Boolean) as { icon: string; title: string; content: string }[]

  return (
    <>
      <div className="breadcrumb">
        <div className="container">
          <ol>
            <li><Link href="/">Trang chủ</Link></li>
            <li>Liên hệ</li>
          </ol>
        </div>
      </div>

      <section className="page-section">
        <div className="container">
          <div className="section-title">
            <h2>Liên hệ</h2>
            <p>Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>

            <LienHeForm />

            {/* Thông tin */}
            <div>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--bg-gray)' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-dark)' }}>{item.content}</div>
                  </div>
                </div>
              ))}

              {/* Google Map */}
              {companyInfo.mapEmbedUrl && (
                <div style={{ marginTop: 20, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <iframe
                    src={companyInfo.mapEmbedUrl}
                    width="100%" height="220" style={{ border: 0, display: 'block' }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    title="Địa chỉ trên bản đồ"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
