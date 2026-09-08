import GlassCard from '@/app/admin/_components/GlassCard'
import { addProductDimensionAction, deleteProductDimensionAction } from '../actions'
import DimensionDeleteButton from './DimensionDeleteButton'
import type { ProductDimension } from '@prisma/client'

export default function ProductDimensions({ idSP, dimensions }: { idSP: number; dimensions: ProductDimension[] }) {
  const addAction = addProductDimensionAction.bind(null, idSP)

  return (
    <GlassCard className="p-5 md:p-6">
      <h2 className="mb-1 font-bold text-admin-text">Kích thước / quy cách</h2>
      <p className="mb-4 text-xs text-admin-text-3">1 sản phẩm có thể bán ở nhiều kích thước khác nhau — mỗi dòng là 1 quy cách.</p>

      <div className="mb-4 space-y-2">
        {dimensions.map((d) => (
          <div key={d.id} className="flex items-center justify-between gap-3 rounded-admin-sm border border-admin-border/15 px-3 py-2">
            <span className="text-sm text-admin-text-2">{d.value}</span>
            <DimensionDeleteButton action={deleteProductDimensionAction.bind(null, idSP, d.id)} />
          </div>
        ))}
        {dimensions.length === 0 && <p className="py-1 text-sm text-admin-text-3">Chưa có kích thước nào.</p>}
      </div>

      <form action={addAction} className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          name="value"
          required
          placeholder='VD: "Φ 1.5mm × 100m/cuộn"'
          className="h-10 min-w-[240px] flex-1 rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 dark:bg-white/5"
        />
        <button
          type="submit"
          className="h-10 rounded-admin-sm border border-admin-border/20 px-4 text-sm font-medium text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
        >
          Thêm kích thước
        </button>
      </form>
    </GlassCard>
  )
}
