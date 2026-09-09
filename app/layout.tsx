import type { Metadata } from 'next'
import './globals.css'
import { getSeoSettings, SEO_DEFAULTS } from '@/lib/seo-settings'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings()

  const title = seo?.metaTitle || SEO_DEFAULTS.metaTitle
  const description = seo?.metaDescription || SEO_DEFAULTS.metaDescription

  return {
    metadataBase: new URL('https://soicuongluc.com'),
    title,
    description,
    keywords: 'sợi cường lực, sợi polyester, sợi nylon, sợi carbon, harifa, soicuongluc',
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: seo?.robotsMeta || 'index, follow',
    icons: {
      icon: seo?.faviconUrl || '/favicon.ico',
      apple: seo?.appleTouchIconUrl || '/apple-touch-icon.png',
    },
    openGraph: {
      type: (seo?.ogType as 'website') || 'website',
      url: seo?.ogUrl || SEO_DEFAULTS.ogUrl,
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
      siteName: 'soicuongluc.com',
      locale: 'vi_VN',
    },
    twitter: {
      card: (seo?.twitterCard as 'summary_large_image') || 'summary_large_image',
      title: seo?.twitterTitle || title,
      description: seo?.twitterDescription || description,
      images: seo?.twitterImage ? [seo.twitterImage] : undefined,
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const seo = await getSeoSettings()

  // JSON-LD hợp lệ mới được chèn (parse lại để tránh script hỏng/breakout nếu admin lỡ lưu
  // JSON sai cú pháp - dù saveStructuredDataAction đã validate khi lưu, phòng dữ liệu cũ).
  let structuredDataJson: string | null = null
  if (seo?.structuredDataJson) {
    try {
      structuredDataJson = JSON.stringify(JSON.parse(seo.structuredDataJson))
    } catch {
      structuredDataJson = null
    }
  }

  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        {structuredDataJson && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataJson }} />
        )}
        {children}
      </body>
    </html>
  )
}
