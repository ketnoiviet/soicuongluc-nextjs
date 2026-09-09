'use client'

import { useFormState } from 'react-dom'
import Image from 'next/image'
import type { ActionState } from './ActionForm'
import SubmitButton from './SubmitButton'

/**
 * Preview ảnh hiện tại + input file + nút "Lưu" riêng, submit multipart qua 1 Server Action -
 * dùng cho Logo/Favicon/Apple-touch-icon ở Cài đặt SEO (khác InlineSaveField vì cần FormData
 * thật cho file, không thể gọi thẳng action(value) như textbox).
 */
export default function InlineImageField({
  label,
  fieldName,
  currentUrl,
  action,
  hint,
  previewSize = 64,
}: {
  label: string
  fieldName: string
  currentUrl?: string | null
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  hint?: string
  previewSize?: number
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(action, { error: null })

  return (
    <form action={formAction} className="space-y-2">
      <label className="block text-sm font-medium text-admin-text-2">{label}</label>
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex shrink-0 items-center justify-center overflow-hidden rounded-admin-sm border border-admin-border/20 bg-white/50 dark:bg-white/5"
          style={{ height: previewSize, width: previewSize }}
        >
          {currentUrl ? (
            <Image
              src={currentUrl}
              alt={label}
              width={previewSize}
              height={previewSize}
              className="size-full object-contain"
              unoptimized
            />
          ) : (
            <span className="text-[10px] text-admin-text-3">Chưa có</span>
          )}
        </div>
        <input
          type="file"
          name={fieldName}
          accept="image/*"
          className="flex-1 text-sm text-admin-text-2 file:mr-3 file:rounded-admin-sm file:border-0 file:bg-admin-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-admin-primary"
        />
        <SubmitButton className="shrink-0 rounded-admin-sm border border-admin-primary/30 bg-admin-primary/10 px-3.5 py-2 text-sm font-medium text-admin-primary transition-colors hover:bg-admin-primary/20 disabled:opacity-60">
          Lưu
        </SubmitButton>
      </div>
      {hint && <p className="text-xs text-admin-text-3">{hint}</p>}
      {state?.error && <p className="text-xs text-admin-rose">{state.error}</p>}
      {state?.success && <p className="text-xs text-admin-emerald">{state.success}</p>}
    </form>
  )
}
