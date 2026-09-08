import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { getImageUrl, formatDate } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteBaiVietAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function BaiVietListPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() || ''

  const items = await prisma.newsArticle.findMany({
    where: q ? { title: { contains: q } } : undefined,
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  })

  return (
    <div>
      <PageHeader title="Bài viết / Tin tức" description={`${items.length} bài viết`} actionHref="/admin/bai-viet/new" actionLabel="Thêm bài viết" />

      <form className="flex gap-3 mb-4" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Tìm theo tiêu đề..."
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button type="submit" className="text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">
          Tìm
        </button>
        {q && (
          <Link href="/admin/bai-viet" className="text-sm px-4 py-2 rounded-lg text-slate-500 hover:text-slate-700">
            Xóa lọc
          </Link>
        )}
      </form>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Ảnh</th>
              <th className="px-4 py-3 font-medium">Tiêu đề</th>
              <th className="px-4 py-3 font-medium">Danh mục</th>
              <th className="px-4 py-3 font-medium">Ngày đăng</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-2.5">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 relative">
                    <Image src={getImageUrl(item.thumbnailUrl)} alt={item.title} fill className="object-cover" sizes="40px" />
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <p className="font-medium text-slate-800 line-clamp-1">{item.title}</p>
                </td>
                <td className="px-4 py-2.5 text-slate-500">{item.category?.name || '—'}</td>
                <td className="px-4 py-2.5 text-slate-500">{formatDate(item.publishedAt)}</td>
                <td className="px-4 py-2.5">
                  {item.status === 'PUBLISHED' ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Đang hoạt động</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Đã ẩn</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/bai-viet/${item.id}`}
                      className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Sửa
                    </Link>
                    <ConfirmDeleteButton
                      action={deleteBaiVietAction.bind(null, item.id)}
                      confirmMessage={`Xóa bài viết "${item.title}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  Không tìm thấy bài viết nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
