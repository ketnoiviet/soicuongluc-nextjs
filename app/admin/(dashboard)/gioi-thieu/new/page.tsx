import PageHeader from '@/app/admin/_components/PageHeader'
import GioiThieuForm from '../Form'
import { createGioiThieuAction } from '../actions'

export default function NewGioiThieuPage() {
  return (
    <div>
      <PageHeader title="Thêm bài viết giới thiệu" backHref="/admin/gioi-thieu" />
      <GioiThieuForm action={createGioiThieuAction} />
    </div>
  )
}
