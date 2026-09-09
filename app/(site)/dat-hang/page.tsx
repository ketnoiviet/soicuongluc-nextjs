import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCompanyInfo } from '@/lib/company-info'
import { SITE_NAME } from '@/lib/site-name'
import DatHangForm from './DatHangForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: `Nhận báo giá | ${SITE_NAME}` }

export default async function DatHangPage() {
  const [categories, companyInfo] = await Promise.all([
    prisma.productCategory.findMany({
      where: { status: 'PUBLISHED', parentId: null },
      orderBy: { sortOrder: 'asc' },
      select: { name: true, slug: true },
    }),
    getCompanyInfo(),
  ])

  return (
    <>
      <div className="breadcrumb">
        <div className="container">
          <ol>
            <li><Link href="/">Trang chủ</Link></li>
            <li>Nhận báo giá</li>
          </ol>
        </div>
      </div>

      <section className="page-section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="section-title">
            <h2>Yêu cầu Báo giá</h2>
            <p>Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 2 giờ làm việc</p>
          </div>

          <DatHangForm categories={categories} phone={companyInfo.phone} />

          {(companyInfo.phone || companyInfo.zalo) && (
            <div style={{ marginTop: 24, background: 'var(--primary)', color: '#fff', borderRadius: 10, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Cần hỗ trợ ngay?</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Gọi trực tiếp để được tư vấn và báo giá nhanh nhất</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {companyInfo.phone && (
                  <a href={`tel:${companyInfo.phone}`} style={{ background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: 6, fontWeight: 700, fontSize: 14 }}>
                    📞 {companyInfo.phone}
                  </a>
                )}
                {companyInfo.zalo && (
                  <a href={`https://zalo.me/${companyInfo.zalo}`} target="_blank" rel="noopener"
                    style={{ background: '#0068ff', color: '#fff', padding: '10px 20px', borderRadius: 6, fontWeight: 700, fontSize: 14 }}>
                    🔵 Zalo
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
