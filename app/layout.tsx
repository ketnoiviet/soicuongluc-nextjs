import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Sợi cường lực HARIFA | soicuongluc.com',
  description: 'HARIFA - Nhà phân phối chính hãng sợi cường lực: Sợi polyester, sợi nylon, sợi carbon, lốp xe công nghiệp. Uy tín - Chất lượng - Chính hãng.',
  keywords: 'sợi cường lực, sợi polyester, sợi nylon, sợi carbon, harifa, soicuongluc',
  openGraph: {
    title: 'Sợi cường lực HARIFA',
    description: 'Nhà phân phối sợi cường lực chính hãng tại Việt Nam',
    url: 'https://soicuongluc.com',
    siteName: 'soicuongluc.com',
    locale: 'vi_VN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
