'use client'

import { useFormStatus } from 'react-dom'
import { useUploadPending } from '@/lib/uploadTracker'

export default function SubmitButton({
  children = 'Lưu',
  pendingLabel = 'Đang lưu...',
  className = '',
}: {
  children?: React.ReactNode
  pendingLabel?: string
  className?: string
}) {
  const { pending } = useFormStatus()
  // Khoá nút khi TinyMCE còn đang upload ảnh dán (paste/print-screen) dở dang - tránh lưu
  // nội dung có chứa blob: URL tạm thời chưa được thay bằng URL thật trên server.
  const uploadingImage = useUploadPending()

  return (
    <button
      type="submit"
      disabled={pending || uploadingImage}
      className={
        className ||
        'admin-gradient rounded-admin-md px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgb(var(--admin-primary)/0.6)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60'
      }
    >
      {pending ? pendingLabel : uploadingImage ? 'Đang tải ảnh...' : children}
    </button>
  )
}
