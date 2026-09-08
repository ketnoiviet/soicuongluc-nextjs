'use client'

import { useEffect, useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import GlassCard from '@/app/admin/_components/GlassCard'
import { stripHtml, slugify } from '@/lib/utils'
import type { Product, ProductRedirect } from '@prisma/client'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'
const labelCls = 'mb-1 block text-sm font-medium text-admin-text-2'

type Check = { label: string; pass: boolean }

function computeChecks(kw: string, title: string, metaDesc: string, slug: string, contentText: string): Check[] {
  const kwL = kw.trim().toLowerCase()
  if (!kwL) return []

  const titleL = title.toLowerCase()
  const metaL = metaDesc.toLowerCase()
  const slugKw = slugify(kw)
  const contentL = contentText.toLowerCase()
  const words = contentText.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const first100 = words.slice(0, 100).join(' ').toLowerCase()
  const kwWordCount = kwL.split(/\s+/).filter(Boolean).length
  const occurrences = kwL ? contentL.split(kwL).length - 1 : 0
  const density = wordCount > 0 ? (occurrences * kwWordCount * 100) / wordCount : 0

  return [
    { label: 'Từ khoá xuất hiện trong Meta Title', pass: titleL.includes(kwL) },
    { label: 'Từ khoá xuất hiện trong Meta Description', pass: metaL.includes(kwL) },
    { label: 'Từ khoá xuất hiện trong Đường dẫn (URL)', pass: !!slugKw && slug.includes(slugKw) },
    { label: 'Từ khoá xuất hiện trong nội dung chi tiết', pass: contentL.includes(kwL) },
    { label: 'Từ khoá xuất hiện trong 100 từ đầu nội dung', pass: first100.includes(kwL) },
    { label: 'Mật độ từ khoá hợp lý (0.5% – 2.5%)', pass: density >= 0.5 && density <= 2.5 },
    { label: 'Độ dài Meta Title hợp lý (10 – 60 ký tự)', pass: title.length >= 10 && title.length <= 60 },
    { label: 'Độ dài Meta Description hợp lý (50 – 160 ký tự)', pass: metaDesc.length >= 50 && metaDesc.length <= 160 },
    { label: 'Nội dung đủ dài (tối thiểu 300 từ)', pass: wordCount >= 300 },
  ]
}

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 80
      ? 'bg-admin-emerald/10 text-admin-emerald'
      : score >= 50
        ? 'bg-admin-amber/10 text-admin-amber'
        : 'bg-admin-rose/10 text-admin-rose'
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${cls}`}>Điểm SEO: {score}/100</span>
}

function RedirectRow({ r, onDelete }: { r: ProductRedirect; onDelete: (id: number) => Promise<void> }) {
  const [isPending, startTransition] = useTransition()
  return (
    <div className="flex items-center justify-between gap-3 rounded-admin-sm border border-admin-border/15 px-3 py-2">
      <span className="truncate text-sm text-admin-text-2">/san-pham/chi-tiet/{r.oldSlug}</span>
      <button
        type="button"
        aria-label="Xoá redirect"
        disabled={isPending}
        onClick={() => {
          if (window.confirm('Xoá chuyển hướng 301 này?')) {
            startTransition(async () => {
              try {
                await onDelete(r.id)
              } catch (e) {
                window.alert(e instanceof Error ? e.message : 'Có lỗi xảy ra.')
              }
            })
          }
        }}
        className="flex size-7 shrink-0 items-center justify-center rounded-admin-sm text-admin-text-3 transition-colors hover:bg-admin-rose/10 hover:text-admin-rose disabled:opacity-50"
      >
        {isPending ? '…' : <Trash2 className="size-3.5" />}
      </button>
    </div>
  )
}

export default function ProductSeoBox({
  item,
  redirects = [],
  deleteRedirectAction,
}: {
  item?: Product
  redirects?: ProductRedirect[]
  deleteRedirectAction?: (redirectId: number) => Promise<void>
}) {
  const [focusKeyword, setFocusKeyword] = useState(item?.focusKeyword || '')
  const [metaTitle, setMetaTitle] = useState(item?.metaTitle || item?.name || '')
  const [metaDescription, setMetaDescription] = useState(
    item?.metaDescription || stripHtml(item?.shortDescription || '').slice(0, 160)
  )
  const [liveSlug, setLiveSlug] = useState(item?.slug || '')
  const [contentText, setContentText] = useState('')

  // Đọc dữ liệu sống từ các input khác trong cùng Form (tên, slug, nội dung chi tiết) vì
  // các trường đó nằm ở component khác/không dùng chung React state - đọc trực tiếp qua DOM.
  useEffect(() => {
    const read = () => {
      const slugEl = document.querySelector<HTMLInputElement>('input[name="slug"]')
      const descEl = document.querySelector<HTMLInputElement>('input[name="descriptionHtml"]')
      if (slugEl) setLiveSlug(slugEl.value)
      if (descEl) setContentText(stripHtml(descEl.value))
    }
    read()
    const interval = setInterval(read, 800)
    return () => clearInterval(interval)
  }, [])

  const checks = computeChecks(focusKeyword, metaTitle, metaDescription, liveSlug, contentText)
  const score = checks.length ? Math.round((checks.filter((c) => c.pass).length / checks.length) * 100) : 0

  return (
    <GlassCard className="p-5 md:p-6 lg:col-span-3">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-bold text-admin-text">Kiểm tra SEO</h2>
        {checks.length > 0 && <ScoreBadge score={score} />}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Từ khoá chính</label>
          <input
            name="focusKeyword"
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            placeholder="VD: sợi polyester cường lực"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Meta URL (slug)</label>
          <input readOnly value={`/san-pham/chi-tiet/${liveSlug || '...'}`} className={`${inputCls} bg-admin-text-3/5 text-admin-text-3`} />
        </div>
        <div>
          <label className={labelCls}>Meta Title</label>
          <input name="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputCls} />
          <p className="mt-1 text-right text-xs text-admin-text-3">{metaTitle.length}/60 ký tự</p>
        </div>
        <div>
          <label className={labelCls}>Meta Description</label>
          <textarea
            name="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            className={inputCls}
          />
          <p className="mt-1 text-right text-xs text-admin-text-3">{metaDescription.length}/160 ký tự</p>
        </div>
      </div>

      {checks.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {checks.map((c, i) => (
            <li key={i} className={`flex items-center gap-2 text-sm ${c.pass ? 'text-admin-emerald' : 'text-admin-text-3'}`}>
              <span className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] ${c.pass ? 'bg-admin-emerald/15 text-admin-emerald' : 'bg-admin-rose/10 text-admin-rose'}`}>
                {c.pass ? '✓' : '✗'}
              </span>
              {c.label}
            </li>
          ))}
        </ul>
      )}
      {checks.length === 0 && <p className="mt-3 text-sm text-admin-text-3">Nhập từ khoá chính để chấm điểm SEO.</p>}

      {item && (
        <div className="mt-6 border-t border-admin-border/15 pt-4">
          <label className="flex cursor-pointer items-start gap-2.5">
            <input type="checkbox" name="createRedirect" className="mt-0.5 size-4 rounded border-admin-border/30 text-admin-primary focus:ring-admin-primary/40" />
            <span className="text-sm text-admin-text-2">
              Tạo chuyển hướng 301 từ đường dẫn cũ <strong>({item.slug})</strong> khi lưu nếu đường dẫn (slug) thay đổi.
            </span>
          </label>

          {redirects.length > 0 && deleteRedirectAction && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-medium text-admin-text-3">Các chuyển hướng 301 đang áp dụng:</p>
              {redirects.map((r) => (
                <RedirectRow key={r.id} r={r} onDelete={deleteRedirectAction} />
              ))}
            </div>
          )}
        </div>
      )}
    </GlassCard>
  )
}
