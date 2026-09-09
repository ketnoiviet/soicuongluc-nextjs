'use client'

import { useState, useTransition } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'

/**
 * 1 textbox (hoặc textarea) + nút "Lưu" riêng ngay bên cạnh, gọi thẳng 1 server action khi bấm -
 * dùng cho Cài đặt SEO nơi mỗi thẻ meta được lưu độc lập thay vì gộp chung 1 form lớn.
 */
export default function InlineSaveField({
  label,
  defaultValue,
  action,
  placeholder,
  multiline,
  rows = 3,
  mono,
  hint,
}: {
  label: string
  defaultValue?: string | null
  action: (value: string) => Promise<{ error?: string } | void>
  placeholder?: string
  multiline?: boolean
  rows?: number
  mono?: boolean
  hint?: string
}) {
  const [value, setValue] = useState(defaultValue || '')
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    startTransition(async () => {
      try {
        const result = await action(value)
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
    <div>
      <label className="mb-1 block text-sm font-medium text-admin-text-2">{label}</label>
      <div className="flex items-start gap-2">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            spellCheck={!mono}
            className={cn(inputCls, mono && 'font-mono text-xs')}
          />
        ) : (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className={inputCls}
          />
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className={cn(
            'flex h-fit shrink-0 items-center gap-1.5 rounded-admin-sm border px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-60',
            status === 'saved'
              ? 'border-admin-emerald/30 bg-admin-emerald/10 text-admin-emerald'
              : 'border-admin-primary/30 bg-admin-primary/10 text-admin-primary hover:bg-admin-primary/20'
          )}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : status === 'saved' ? <Check className="size-4" /> : null}
          {isPending ? 'Đang lưu...' : status === 'saved' ? 'Đã lưu' : 'Lưu'}
        </button>
      </div>
      {hint && <p className="mt-1 text-xs text-admin-text-3">{hint}</p>}
      {status === 'error' && error && <p className="mt-1 text-xs text-admin-rose">{error}</p>}
    </div>
  )
}
