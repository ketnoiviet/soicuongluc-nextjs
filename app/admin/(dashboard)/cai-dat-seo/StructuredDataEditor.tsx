'use client'

import { useState, useTransition } from 'react'
import { Check, Loader2 } from 'lucide-react'
import AdminSelect from '@/app/admin/_components/AdminSelect'
import { STRUCTURED_DATA_TYPES, STRUCTURED_DATA_TYPE_LABELS, type StructuredDataType } from '@/lib/enums'
import { saveStructuredDataAction } from './actions'

const TEMPLATES: Record<StructuredDataType, object> = {
  Organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HARIFA',
    url: 'https://soicuongluc.com',
    logo: 'https://soicuongluc.com/images/og-share.jpg',
    contactPoint: { '@type': 'ContactPoint', telephone: '+84-916-666-779', contactType: 'sales' },
  },
  LocalBusiness: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'HARIFA',
    url: 'https://soicuongluc.com',
    telephone: '+84-916-666-779',
    address: { '@type': 'PostalAddress', addressCountry: 'VN' },
  },
  WebSite: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'soicuongluc.com',
    url: 'https://soicuongluc.com',
  },
  Product: {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Tên sản phẩm',
    description: 'Mô tả sản phẩm',
    brand: { '@type': 'Brand', name: 'HARIFA' },
  },
  BreadcrumbList: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://soicuongluc.com' }],
  },
}

export default function StructuredDataEditor({
  initialType,
  initialJson,
}: {
  initialType: string
  initialJson: string
}) {
  const [type, setType] = useState(initialType)
  const [json, setJson] = useState(initialJson)
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const insertTemplate = () => {
    const t = TEMPLATES[type as StructuredDataType] || TEMPLATES.Organization
    setJson(JSON.stringify(t, null, 2))
  }

  const handleSave = () => {
    startTransition(async () => {
      try {
        const result = await saveStructuredDataAction(type, json)
        if (result?.error) {
          setStatus('error')
          setError(result.error)
        } else {
          setStatus('saved')
          setError(null)
          setTimeout(() => setStatus((s) => (s === 'saved' ? 'idle' : s)), 2000)
        }
      } catch (e) {
        setStatus('error')
        setError(e instanceof Error ? e.message : 'Có lỗi xảy ra, vui lòng thử lại.')
      }
    })
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label className="mb-1 block text-sm font-medium text-admin-text-2">Kiểu dữ liệu có cấu trúc</label>
          <AdminSelect
            value={type}
            onChange={setType}
            className="w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text dark:bg-white/5"
          >
            {STRUCTURED_DATA_TYPES.map((t) => (
              <option key={t} value={t}>
                {STRUCTURED_DATA_TYPE_LABELS[t]}
              </option>
            ))}
          </AdminSelect>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={insertTemplate}
            className="h-10 shrink-0 rounded-admin-sm border border-admin-border/20 px-3.5 text-sm font-medium text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
          >
            Chèn mẫu
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-admin-text-2">JSON-LD</label>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={12}
          spellCheck={false}
          placeholder="Bấm &quot;Chèn mẫu&quot; để tạo JSON mẫu theo kiểu đã chọn ở trên"
          className="w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 font-mono text-xs text-admin-text outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-admin-sm border border-admin-primary/30 bg-admin-primary/10 px-3.5 py-2 text-sm font-medium text-admin-primary transition-colors hover:bg-admin-primary/20 disabled:opacity-60"
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : status === 'saved' ? <Check className="size-4" /> : null}
          {isPending ? 'Đang lưu...' : status === 'saved' ? 'Đã lưu' : 'Lưu'}
        </button>
        {status === 'error' && error && <p className="text-xs text-admin-rose">{error}</p>}
      </div>
    </div>
  )
}
