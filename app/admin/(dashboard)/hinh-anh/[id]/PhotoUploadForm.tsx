'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GALLERY_ALBUM_MAX_FILES as MAX_FILES } from '@/lib/constants'

export default function PhotoUploadForm({ albumId }: { albumId: number }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = () => {
    const files = inputRef.current?.files
    if (!files || files.length === 0) return
    if (files.length > MAX_FILES) {
      setError(`Chỉ được chọn tối đa ${MAX_FILES} ảnh mỗi lần.`)
      return
    }
    setError(null)

    const formData = new FormData()
    for (const file of Array.from(files)) formData.append('anh', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/api/admin/hinh-anh/${albumId}/upload`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      setProgress(null)
      if (inputRef.current) inputRef.current.value = ''

      if (xhr.status < 200 || xhr.status >= 300) {
        try {
          setError(JSON.parse(xhr.responseText)?.error || 'Tải ảnh lên thất bại.')
        } catch {
          setError('Tải ảnh lên thất bại.')
        }
        return
      }

      try {
        const data = JSON.parse(xhr.responseText) as { created: number; errors: string[] }
        if (data.errors?.length > 0) {
          setError(`Tải lên ${data.created} ảnh thành công, ${data.errors.length} ảnh lỗi: ${data.errors.join('; ')}`)
        }
      } catch {
        // phản hồi không parse được nhưng status 2xx - bỏ qua, coi như thành công
      }
      router.refresh()
    }
    xhr.onerror = () => {
      setProgress(null)
      setError('Tải ảnh lên thất bại. Vui lòng thử lại.')
    }
    setProgress(0)
    xhr.send(formData)
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          name="anh"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="text-sm text-admin-text-2 file:mr-3 file:rounded-admin-sm file:border-0 file:bg-admin-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-admin-primary"
        />
        <span className="text-xs text-admin-text-3">Chọn tối đa {MAX_FILES} ảnh cùng lúc, tự động chuyển WebP.</span>
      </div>
      {error && <p className="mt-2 text-sm text-admin-rose">{error}</p>}

      {progress !== null && (
        <div className="fixed bottom-6 right-6 z-50 w-72 rounded-admin-md border border-admin-border/20 bg-white/95 p-4 shadow-xl backdrop-blur dark:bg-admin-bg/95">
          <p className="mb-2 text-sm font-medium text-admin-text">Đang tải ảnh lên... {progress}%</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-admin-text-3/15">
            <div className="h-full rounded-full bg-admin-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </>
  )
}
