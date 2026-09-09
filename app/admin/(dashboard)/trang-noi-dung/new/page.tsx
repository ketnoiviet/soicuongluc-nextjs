import PageHeader from '@/app/admin/_components/PageHeader'
import TrangNoiDungForm from '../Form'
import { createTrangNoiDungAction } from '../actions'

export default function NewTrangNoiDungPage() {
  return (
    <div>
      <PageHeader title="Thêm trang nội dung" backHref="/admin/trang-noi-dung" />
      <TrangNoiDungForm action={createTrangNoiDungAction} />
    </div>
  )
}
