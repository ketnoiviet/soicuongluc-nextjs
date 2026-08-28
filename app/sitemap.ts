import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://soicuongluc.com'

  const [categories, products, articles] = await Promise.all([
    prisma.sanPhamLoai.findMany({ where: { hieuLuc: 1 }, select: { url: true } }),
    prisma.sanPham.findMany({ where: { hieuLuc: 1 }, select: { link: true, ngay: true } }),
    prisma.baiViet.findMany({ where: { hieuLuc: 1 }, select: { link: true, ngay: true } }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/gioi-thieu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tin-tuc`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/lien-he`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/dat-hang`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter(c => c.url)
    .map(c => ({ url: `${baseUrl}/san-pham/${c.url}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 }))

  const productPages: MetadataRoute.Sitemap = products
    .filter(p => p.link)
    .map(p => ({ url: `${baseUrl}/san-pham/chi-tiet/${p.link}`, lastModified: p.ngay || new Date(), changeFrequency: 'monthly' as const, priority: 0.7 }))

  const articlePages: MetadataRoute.Sitemap = articles
    .filter(a => a.link)
    .map(a => ({ url: `${baseUrl}/tin-tuc/${a.link}`, lastModified: a.ngay || new Date(), changeFrequency: 'monthly' as const, priority: 0.6 }))

  return [...staticPages, ...categoryPages, ...productPages, ...articlePages]
}
