import PageHeader from '@/app/admin/_components/PageHeader'
import NhanXetForm from '../Form'
import { createNhanXetAction } from '../actions'

export default function NewNhanXetPage() {
  return (
    <div>
      <PageHeader title="Thêm nhận xét khách hàng" backHref="/admin/nhan-xet-khach-hang" />
      <NhanXetForm action={createNhanXetAction} />
    </div>
  )
}
