import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const [categories, products, articles] = await Promise.all([
    prisma.productCategory.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true } }),
    prisma.product.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, createdAt: true } }),
    prisma.newsArticle.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, publishedAt: true } }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/gioi-thieu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tin-tuc`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/lien-he`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/dat-hang`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug)
    .map((c) => ({ url: `${baseUrl}/san-pham/${c.slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 }))

  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => p.slug)
    .map((p) => ({ url: `${baseUrl}/san-pham/chi-tiet/${p.slug}`, lastModified: p.createdAt || new Date(), changeFrequency: 'monthly' as const, priority: 0.7 }))

  const articlePages: MetadataRoute.Sitemap = articles
    .filter((a) => a.slug)
    .map((a) => ({ url: `${baseUrl}/tin-tuc/${a.slug}`, lastModified: a.publishedAt || new Date(), changeFrequency: 'monthly' as const, priority: 0.6 }))

  return [...staticPages, ...categoryPages, ...productPages, ...articlePages]
}
