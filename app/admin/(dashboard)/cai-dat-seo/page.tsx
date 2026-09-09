import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import InlineSaveField from '@/app/admin/_components/InlineSaveField'
import InlineImageField from '@/app/admin/_components/InlineImageField'
import { getSeoSettings, SEO_DEFAULTS } from '@/lib/seo-settings'
import { readRobotsTxt } from '@/lib/seo-files'
import {
  saveSeoFieldAction,
  saveSeoLogoAction,
  saveFaviconFileAction,
  saveAppleTouchIconFileAction,
  saveRobotsTxtAction,
} from './actions'
import StructuredDataEditor from './StructuredDataEditor'

export const dynamic = 'force-dynamic'

const cardTitleCls = 'mb-1 font-bold text-admin-text'
const cardDescCls = 'mb-4 text-xs text-admin-text-3'

export default async function CaiDatSeoPage() {
  const [seo, robotsTxt] = await Promise.all([getSeoSettings(), readRobotsTxt()])
  const exampleUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'

  const field = (name: Parameters<typeof saveSeoFieldAction>[0]) => saveSeoFieldAction.bind(null, name)

  return (
    <div>
      <PageHeader
        title="Cài đặt SEO"
        description="Thẻ meta, Open Graph/Twitter Card, favicon và dữ liệu cấu trúc dùng cho <head> trang chủ."
      />

      <div className="space-y-6">
        <GlassCard className="p-5 md:p-6">
          <h2 className={cardTitleCls}>Thẻ SEO cốt lõi</h2>
          <p className={cardDescCls}>Bắt buộc - dùng dựng thẻ &lt;title&gt;, meta description, canonical và robots cho trang chủ.</p>
          <div className="space-y-4">
            <InlineSaveField label="Meta title" defaultValue={seo?.metaTitle ?? SEO_DEFAULTS.metaTitle} action={field('metaTitle')} />
            <InlineSaveField
              label="Meta description"
              defaultValue={seo?.metaDescription ?? SEO_DEFAULTS.metaDescription}
              action={field('metaDescription')}
              multiline
            />
            <InlineSaveField
              label="Canonical URL"
              defaultValue={seo?.canonicalUrl}
              placeholder={`${exampleUrl}/`}
              action={field('canonicalUrl')}
              hint='Xuất ra <link rel="canonical" href="...">'
            />
            <InlineSaveField
              label="Robots"
              defaultValue={seo?.robotsMeta ?? 'index, follow'}
              action={field('robotsMeta')}
              hint='Xuất ra <meta name="robots" content="...">'
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5 md:p-6">
          <h2 className={cardTitleCls}>Chia sẻ mạng xã hội (Open Graph & Twitter Card)</h2>
          <p className={cardDescCls}>Hiển thị khi link trang chủ được chia sẻ lên Facebook/Zalo/Twitter...</p>
          <div className="space-y-4">
            <InlineSaveField label="og:type" defaultValue={seo?.ogType ?? 'website'} action={field('ogType')} />
            <InlineSaveField label="og:url" defaultValue={seo?.ogUrl ?? SEO_DEFAULTS.ogUrl} action={field('ogUrl')} />
            <InlineSaveField label="og:title" defaultValue={seo?.ogTitle ?? SEO_DEFAULTS.ogTitle} action={field('ogTitle')} />
            <InlineSaveField
              label="og:description"
              defaultValue={seo?.ogDescription ?? SEO_DEFAULTS.ogDescription}
              action={field('ogDescription')}
              multiline
            />
            <InlineSaveField
              label="og:image"
              defaultValue={seo?.ogImage}
              placeholder={`${exampleUrl}/images/og-share.jpg`}
              action={field('ogImage')}
            />
            <hr className="border-admin-border/12" />
            <InlineSaveField
              label="twitter:card"
              defaultValue={seo?.twitterCard ?? 'summary_large_image'}
              action={field('twitterCard')}
            />
            <InlineSaveField label="twitter:title" defaultValue={seo?.twitterTitle} action={field('twitterTitle')} />
            <InlineSaveField
              label="twitter:description"
              defaultValue={seo?.twitterDescription}
              action={field('twitterDescription')}
              multiline
            />
            <InlineSaveField
              label="twitter:image"
              defaultValue={seo?.twitterImage}
              placeholder={`${exampleUrl}/images/og-share.jpg`}
              action={field('twitterImage')}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5 md:p-6">
          <h2 className={cardTitleCls}>Logo & Favicon</h2>
          <p className={cardDescCls}>Logo hiển thị ở header trang chủ; favicon/apple-touch-icon hiển thị trên tab trình duyệt.</p>
          <div className="space-y-5">
            <InlineImageField
              label="Logo website"
              fieldName="logo"
              currentUrl={seo?.logoUrl}
              action={saveSeoLogoAction}
              hint="Ảnh sẽ tự chuyển WebP, rộng tối đa 500px."
            />
            <hr className="border-admin-border/12" />
            <InlineSaveField
              label="Favicon (đường dẫn)"
              defaultValue={seo?.faviconUrl ?? '/favicon.ico'}
              action={field('faviconUrl')}
              hint='Xuất ra <link rel="icon" href="..." sizes="any">'
            />
            <InlineImageField
              label="Tải favicon mới"
              fieldName="favicon"
              currentUrl={seo?.faviconUrl}
              action={saveFaviconFileAction}
              hint="Nhận PNG/JPG/WEBP/GIF/ICO. Ảnh thường được resize về 64x64."
            />
            <hr className="border-admin-border/12" />
            <InlineSaveField
              label="Apple touch icon (đường dẫn)"
              defaultValue={seo?.appleTouchIconUrl ?? '/apple-touch-icon.png'}
              action={field('appleTouchIconUrl')}
              hint='Xuất ra <link rel="apple-touch-icon" href="...">'
            />
            <InlineImageField
              label="Tải apple-touch-icon mới"
              fieldName="appleTouchIcon"
              currentUrl={seo?.appleTouchIconUrl}
              action={saveAppleTouchIconFileAction}
              hint="Ảnh sẽ tự resize về 180x180 (kích thước Apple khuyến nghị)."
              previewSize={72}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5 md:p-6">
          <h2 className={cardTitleCls}>Dữ liệu cấu trúc (JSON-LD)</h2>
          <p className={cardDescCls}>Chọn kiểu dữ liệu, chỉnh JSON rồi Lưu - được chèn vào trang chủ dạng &lt;script type=&quot;application/ld+json&quot;&gt;.</p>
          <StructuredDataEditor initialType={seo?.structuredDataType ?? 'Organization'} initialJson={seo?.structuredDataJson ?? ''} />
        </GlassCard>

        <GlassCard className="p-5 md:p-6">
          <h2 className={cardTitleCls}>Robots & Sitemap</h2>
          <p className={cardDescCls}>Chỉnh trực tiếp nội dung file tĩnh public/robots.txt.</p>
          <div className="space-y-3">
            <InlineSaveField label="robots.txt" defaultValue={robotsTxt} action={saveRobotsTxtAction} multiline rows={8} mono />
            <p className="text-xs text-admin-text-3">
              sitemap.xml được sinh tự động từ dữ liệu sản phẩm/danh mục/bài viết đang hiển thị, luôn cập nhật khi có nội
              dung mới - không chỉnh tay được nữa.{' '}
              <a href="/sitemap.xml" target="_blank" rel="noopener" className="text-admin-primary underline">
                Xem sitemap.xml hiện tại
              </a>
              .
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
