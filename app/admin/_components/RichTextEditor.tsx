'use client'

import { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditorType } from 'tinymce'
import { beginUpload, endUpload } from '@/lib/uploadTracker'

export default function RichTextEditor({
  name,
  defaultValue,
  height = 320,
  maxLength,
}: {
  name: string
  defaultValue?: string | null
  height?: number
  /** Giới hạn số ký tự văn bản thuần (không tính thẻ HTML). Hiện bộ đếm khi có giá trị. */
  maxLength?: number
}) {
  const hiddenRef = useRef<HTMLInputElement>(null)
  const [charCount, setCharCount] = useState(() => (defaultValue ? defaultValue.replace(/<[^>]*>/g, '').length : 0))

  return (
    <>
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue || ''} />
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        initialValue={defaultValue || ''}
        init={{
          height,
          menubar: false,
          branding: false,
          promotion: false,
          plugins: 'link lists image table code fullscreen media',
          toolbar:
            'undo redo | blocks | bold italic underline | forecolor backcolor | ' +
            'alignleft aligncenter alignright | bullist numlist | link image media table | code fullscreen',
          // Cho phép dán ảnh copy/paste và print-screen trực tiếp: TinyMCE tự chuyển ảnh dán (base64)
          // thành blob và đẩy qua images_upload_handler bên dưới (vẫn qua saveEditorImage -> WebP), không
          // lưu base64 thẳng vào nội dung.
          paste_data_images: true,
          images_file_types: 'jpeg,jpg,png,gif,webp',
          // Giữ nguyên đường dẫn tuyệt đối server trả về, không để TinyMCE quy đổi thành relative URL.
          relative_urls: false,
          images_upload_handler: async (blobInfo) => {
            beginUpload()
            try {
              const uploadData = new FormData()
              uploadData.append('file', blobInfo.blob(), blobInfo.filename())
              const res = await fetch('/api/admin/upload-image', {
                method: 'POST',
                body: uploadData,
              })
              const data = await res.json()
              if (!res.ok) throw new Error(data?.error || 'Tải ảnh lên thất bại.')
              return data.location as string
            } finally {
              endUpload()
            }
          },
          automatic_uploads: true,
        }}
        onEditorChange={(content: string, editor: TinyMCEEditorType) => {
          if (maxLength) {
            const text = editor.getContent({ format: 'text' })
            if (text.length > maxLength) {
              // Vượt giới hạn: quay lại nội dung dạng text đã cắt để tránh cắt hỏng thẻ HTML.
              const truncated = text.slice(0, maxLength)
              editor.setContent(truncated)
              editor.selection.select(editor.getBody(), true)
              editor.selection.collapse(false)
              if (hiddenRef.current) hiddenRef.current.value = editor.getContent()
              setCharCount(truncated.length)
              return
            }
            setCharCount(text.length)
          }
          if (hiddenRef.current) hiddenRef.current.value = content
        }}
      />
      {maxLength && (
        <p className={`mt-1 text-right text-xs ${charCount > maxLength ? 'text-admin-rose' : 'text-admin-text-3'}`}>
          {charCount}/{maxLength} ký tự
        </p>
      )}
    </>
  )
}
