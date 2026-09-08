'use client'

import { useEffect } from 'react'
import { slugify } from '@/lib/utils'

/**
 * Tự động sinh slug từ tên sản phẩm khi gõ (VD: "sản phẩm a" -> "san-pham-a").
 * Gắn thẳng vào input[name=name]/input[name=slug] có sẵn trong Form qua DOM thay vì
 * biến cả Form thành client component - Form vẫn giữ nguyên là server component.
 * Ngừng tự sinh ngay khi người dùng tự gõ vào ô slug.
 */
export default function SlugAutoFill() {
  useEffect(() => {
    const nameEl = document.querySelector<HTMLInputElement>('input[name="name"]')
    const slugEl = document.querySelector<HTMLInputElement>('input[name="slug"]')
    if (!nameEl || !slugEl) return

    let slugTouched = slugEl.value.trim().length > 0

    const onSlugInput = () => {
      slugTouched = true
    }
    const onNameInput = () => {
      if (!slugTouched) slugEl.value = slugify(nameEl.value)
    }

    slugEl.addEventListener('input', onSlugInput)
    nameEl.addEventListener('input', onNameInput)
    return () => {
      slugEl.removeEventListener('input', onSlugInput)
      nameEl.removeEventListener('input', onNameInput)
    }
  }, [])

  return null
}
