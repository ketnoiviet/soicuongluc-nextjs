import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import GlassCard from '@/app/admin/_components/GlassCard'
import { addSanPhamHinhAction, deleteSanPhamHinhAction } from '../actions'
import GalleryDeleteButton from './GalleryDeleteButton'
import type { ProductImage } from '@prisma/client'

export default function ProductGallery({ idSP, images }: { idSP: number; images: ProductImage[] }) {
  const addAction = addSanPhamHinhAction.bind(null, idSP)

  return (
    <GlassCard className="p-5 md:p-6">
      <h2 className="mb-4 font-bold text-admin-text">Thư viện ảnh sản phẩm</h2>

      <div className="mb-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {images.map((img) => (
          <div key={img.id} className="group relative">
            <div className="relative aspect-square w-full overflow-hidden rounded-admin-sm bg-admin-text-3/10">
              <Image src={getImageUrl(img.imageUrl)} alt={img.altText || ''} fill className="object-cover" sizes="120px" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-admin-sm bg-black/0 opacity-0 transition-colors group-hover:bg-black/40 group-hover:opacity-100">
              <GalleryDeleteButton action={deleteSanPhamHinhAction.bind(null, idSP, img.id)} />
            </div>
          </div>
        ))}
        {images.length === 0 && <p className="col-span-full py-2 text-sm text-admin-text-3">Chưa có ảnh phụ nào.</p>}
      </div>

      <form action={addAction} className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          name="anh"
          accept="image/*"
          required
          className="text-sm text-admin-text-2 file:mr-3 file:rounded-admin-sm file:border-0 file:bg-admin-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-admin-primary"
        />
        <button
          type="submit"
          className="rounded-admin-sm border border-admin-border/20 px-4 py-2 text-sm font-medium text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
        >
          Thêm ảnh
        </button>
      </form>
    </GlassCard>
  )
}
