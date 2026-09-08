'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatDate, getImageUrl, truncate } from '@/lib/utils'

// ===== PRODUCT CARD =====
interface Product {
  id: number
  name?: string | null
  thumbnailUrl?: string | null
  shortDescription?: string | null
  slug?: string | null
  isFeatured?: boolean | null
  isNew?: boolean | null
}

export function ProductCard({ product }: { product: Product }) {
  const href = `/san-pham/chi-tiet/${product.slug || product.id}`
  return (
    <Link href={href} className="product-card">
      <div className="product-card-img">
        <Image
          src={getImageUrl(product.thumbnailUrl)}
          alt={product.name || 'Sản phẩm'}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          style={{ objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/no-image.jpg' }}
        />
        {product.isNew && (
          <span style={{
            position: 'absolute', top: 8, left: 8,
            background: '#e74c3c', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 3,
          }}>MỚI</span>
        )}
        {product.isFeatured && (
          <span style={{
            position: 'absolute', top: 8, right: 8,
            background: 'var(--accent)', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 3,
          }}>NỔI BẬT</span>
        )}
      </div>
      <div className="product-card-body">
        <div className="product-card-title">{product.name}</div>
        {product.shortDescription && (
          <p style={{ fontSize: 12, color: 'var(--text-gray)', marginBottom: 10, lineHeight: 1.5 }}>
            {truncate(product.shortDescription, 80)}
          </p>
        )}
        <span className="btn-detail">Xem chi tiết →</span>
      </div>
    </Link>
  )
}

// ===== NEWS CARD (dạng ngang) =====
interface Article {
  id: number
  title?: string | null
  thumbnailUrl?: string | null
  excerpt?: string | null
  publishedAt?: Date | string | null
  slug?: string | null
}

export function NewsCard({ article }: { article: Article }) {
  const href = `/tin-tuc/${article.slug || article.id}`
  return (
    <Link href={href} className="news-card">
      <div className="news-card-img">
        <Image
          src={getImageUrl(article.thumbnailUrl)}
          alt={article.title || 'Tin tức'}
          width={100} height={70}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/no-image.jpg' }}
        />
      </div>
      <div>
        <div className="news-card-title">{article.title}</div>
        <div className="news-date">{formatDate(article.publishedAt ?? null)}</div>
      </div>
    </Link>
  )
}

// ===== NEWS CARD (dạng dọc - trang tin tức) =====
export function NewsCardVertical({ article }: { article: Article }) {
  const href = `/tin-tuc/${article.slug || article.id}`
  return (
    <Link href={href} style={{ display: 'block', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', transition: 'all 0.2s' }}
      className="product-card">
      <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--bg-light)' }}>
        <Image
          src={getImageUrl(article.thumbnailUrl)}
          alt={article.title || 'Tin tức'}
          fill sizes="(max-width:768px) 100vw, 33vw"
          style={{ objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/no-image.jpg' }}
        />
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 6 }}>
          📅 {formatDate(article.publishedAt ?? null)}
        </div>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-dark)', lineHeight: 1.4, marginBottom: 8,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
          {article.title}
        </div>
        {article.excerpt && (
          <p style={{ fontSize: 12, color: 'var(--text-gray)', lineHeight: 1.6 }}>
            {truncate(article.excerpt, 100)}
          </p>
        )}
      </div>
    </Link>
  )
}
