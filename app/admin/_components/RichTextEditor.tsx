'use client'

import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditorType } from 'tinymce'

export default function RichTextEditor({
  name,
  defaultValue,
  height = 320,
}: {
  name: string
  defaultValue?: string | null
  height?: number
}) {
  const hiddenRef = useRef<HTMLInputElement>(null)

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
          // Ảnh dán trực tiếp (base64) sẽ bị bỏ qua pipeline chuyển WebP ở server - luôn bắt đi qua images_upload_handler.
          paste_data_images: false,
          images_file_types: 'jpeg,jpg,png,gif,webp',
          // Giữ nguyên đường dẫn tuyệt đối server trả về, không để TinyMCE quy đổi thành relative URL.
          relative_urls: false,
          images_upload_handler: async (blobInfo) => {
            const uploadData = new FormData()
            uploadData.append('file', blobInfo.blob(), blobInfo.filename())
            const res = await fetch('/api/admin/upload-image', {
              method: 'POST',
              body: uploadData,
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data?.error || 'Tải ảnh lên thất bại.')
            return data.location as string
          },
          automatic_uploads: true,
        }}
        onEditorChange={(content: string, editor: TinyMCEEditorType) => {
          void editor
          if (hiddenRef.current) hiddenRef.current.value = content
        }}
      />
    </>
  )
}
