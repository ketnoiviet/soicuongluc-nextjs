import PageHeader from '@/app/admin/_components/PageHeader'
import { scanUploadedFiles, getUsedFileUrls } from '@/lib/media-scan'
import MediaManager from './MediaManager'

export const dynamic = 'force-dynamic'

export default async function QuanLyMediaPage() {
  const [files, usedUrls] = await Promise.all([scanUploadedFiles(), getUsedFileUrls()])

  const rows = files.map((f) => ({ ...f, used: usedUrls.has(f.url) }))
  const folders = Array.from(new Set(files.map((f) => f.folder))).sort()

  return (
    <div>
      <PageHeader
        title="Quản lý Media"
        description={`${files.length} file trong public/uploads - quét trực tiếp từ ổ đĩa, đối chiếu với dữ liệu đang dùng trên toàn site`}
      />
      <MediaManager files={rows} folders={folders} />
    </div>
  )
}
