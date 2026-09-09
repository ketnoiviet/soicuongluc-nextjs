'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, ArrowUpDown, FileQuestion, AlertTriangle } from 'lucide-react'
import GlassCard from '@/app/admin/_components/GlassCard'
import AdminSelect from '@/app/admin/_components/AdminSelect'
import StatusBadge from '@/app/admin/_components/StatusBadge'
import { deleteMediaFilesAction } from './actions'

const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'])

export type MediaRow = {
  url: string
  folder: string
  name: string
  ext: string
  size: number
  mtimeMs: number
  used: boolean
}

const selectCls =
  'h-10 w-auto rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 text-sm text-admin-text outline-none focus:border-admin-primary/50 dark:bg-white/5'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatDateTime(ms: number): string {
  return new Date(ms).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function MediaManager({ files, folders }: { files: MediaRow[]; folders: string[] }) {
  const router = useRouter()
  const [folderFilter, setFolderFilter] = useState('')
  const [onlyUnused, setOnlyUnused] = useState(false)
  const [sortAsc, setSortAsc] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  const byUrl = useMemo(() => new Map(files.map((f) => [f.url, f])), [files])

  const filtered = useMemo(() => {
    let list = files
    if (folderFilter) list = list.filter((f) => f.folder === folderFilter)
    if (onlyUnused) list = list.filter((f) => !f.used)
    return [...list].sort((a, b) => (sortAsc ? a.mtimeMs - b.mtimeMs : b.mtimeMs - a.mtimeMs))
  }, [files, folderFilter, onlyUnused, sortAsc])

  const totalSize = files.reduce((s, f) => s + f.size, 0)
  const unusedFiles = files.filter((f) => !f.used)
  const unusedSize = unusedFiles.reduce((s, f) => s + f.size, 0)

  const allFilteredSelected = filtered.length > 0 && filtered.every((f) => selected.has(f.url))
  const toggleAll = () =>
    setSelected((prev) => {
      if (allFilteredSelected) {
        const next = new Set(prev)
        filtered.forEach((f) => next.delete(f.url))
        return next
      }
      const next = new Set(prev)
      filtered.forEach((f) => next.add(f.url))
      return next
    })
  const toggleOne = (url: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(url)) next.delete(url)
      else next.add(url)
      return next
    })

  const doDelete = (urls: string[]) => {
    if (urls.length === 0) return
    const usedCount = urls.filter((u) => byUrl.get(u)?.used).length
    const msg =
      usedCount > 0
        ? `${urls.length} file đã chọn, trong đó ${usedCount} file ĐANG ĐƯỢC SỬ DỤNG trên website. Xóa sẽ làm ảnh/nội dung liên quan bị hỏng ở nơi đang dùng. Bạn có chắc chắn muốn xóa vĩnh viễn?`
        : `Xóa vĩnh viễn ${urls.length} file đã chọn? Không thể hoàn tác.`
    if (!window.confirm(msg)) return
    startTransition(async () => {
      try {
        await deleteMediaFilesAction(urls)
        setSelected(new Set())
        router.refresh()
      } catch (e) {
        window.alert(e instanceof Error ? e.message : 'Có lỗi xảy ra khi xóa file.')
      }
    })
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard className="p-4">
          <p className="text-xs text-admin-text-3">Tổng số file</p>
          <p className="mt-1 text-2xl font-extrabold text-admin-text">{files.length}</p>
          <p className="mt-0.5 text-xs text-admin-text-3">{formatSize(totalSize)}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs text-admin-text-3">File chưa sử dụng</p>
          <p className="mt-1 text-2xl font-extrabold text-admin-amber">{unusedFiles.length}</p>
          <p className="mt-0.5 text-xs text-admin-text-3">{formatSize(unusedSize)} có thể giải phóng</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs text-admin-text-3">Thư mục</p>
          <p className="mt-1 text-2xl font-extrabold text-admin-text">{folders.length}</p>
          <p className="mt-0.5 text-xs text-admin-text-3">trong public/uploads</p>
        </GlassCard>
      </div>

      <GlassCard className="mb-4 flex flex-wrap items-center gap-3 p-3">
        <AdminSelect value={folderFilter} onChange={setFolderFilter} className={selectCls}>
          <option value="">Thư mục: Tất cả</option>
          {folders.map((f) => (
            <option key={f} value={f}>
              {f || '(gốc)'}
            </option>
          ))}
        </AdminSelect>
        <label className="flex h-10 cursor-pointer items-center gap-2 rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 text-sm text-admin-text-2 dark:bg-white/5">
          <input
            type="checkbox"
            checked={onlyUnused}
            onChange={(e) => setOnlyUnused(e.target.checked)}
            className="size-4 rounded border-admin-border/30 text-admin-primary focus:ring-admin-primary/40"
          />
          Chỉ hiện file chưa sử dụng
        </label>
        <button
          type="button"
          onClick={() => setSortAsc((v) => !v)}
          className="flex h-10 items-center gap-1.5 rounded-admin-sm border border-admin-border/20 bg-white/70 px-4 text-sm font-medium text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary dark:bg-white/5"
        >
          <ArrowUpDown className="size-3.5" />
          {sortAsc ? 'Cũ nhất trước' : 'Mới nhất trước'}
        </button>

        {selected.size > 0 && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => doDelete(Array.from(selected))}
            className="ml-auto flex h-10 items-center gap-1.5 rounded-admin-sm border border-admin-rose/25 bg-admin-rose/10 px-4 text-sm font-medium text-admin-rose transition-colors hover:bg-admin-rose/20 disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
            {isPending ? 'Đang xóa...' : `Xóa (${selected.size})`}
          </button>
        )}
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleAll}
                    aria-label="Chọn tất cả"
                    className="size-4 rounded border-admin-border/30 text-admin-primary focus:ring-admin-primary/40"
                  />
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">File</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thư mục</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Dung lượng</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thời gian upload</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/10">
              {filtered.map((file) => (
                <tr key={file.url} className="transition-colors hover:bg-admin-primary/5">
                  <td className="px-4 py-2.5">
                    <input
                      type="checkbox"
                      checked={selected.has(file.url)}
                      onChange={() => toggleOne(file.url)}
                      aria-label={`Chọn ${file.name}`}
                      className="size-4 rounded border-admin-border/30 text-admin-primary focus:ring-admin-primary/40"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-admin-sm bg-admin-text-3/10">
                        {IMAGE_EXTS.has(file.ext) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={file.url} alt="" loading="lazy" className="size-full object-cover" />
                        ) : (
                          <FileQuestion className="size-4 text-admin-text-3" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-admin-text" title={file.name}>
                          {file.name}
                        </p>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener"
                          className="block truncate text-xs text-admin-text-3 hover:text-admin-primary hover:underline"
                        >
                          {file.url}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-admin-text-2">{file.folder || '(gốc)'}</td>
                  <td className="px-4 py-2.5 text-admin-text-2">{formatSize(file.size)}</td>
                  <td className="px-4 py-2.5 text-admin-text-3">{formatDateTime(file.mtimeMs)}</td>
                  <td className="px-4 py-2.5">
                    {file.used ? (
                      <StatusBadge variant="success">Đang dùng</StatusBadge>
                    ) : (
                      <StatusBadge variant="warning">Chưa dùng</StatusBadge>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => doDelete([file.url])}
                        title={file.used ? 'File đang được sử dụng!' : 'Xóa file'}
                        className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-rose/40 hover:text-admin-rose disabled:opacity-50"
                      >
                        {file.used ? <AlertTriangle className="size-3.5" /> : <Trash2 className="size-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-admin-text-3">
                    Không có file nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-admin-border/12 px-4 py-3 text-xs text-admin-text-3">
          <span>Hiển thị {filtered.length} trên {files.length} file</span>
        </div>
      </GlassCard>
    </div>
  )
}
