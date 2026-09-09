import PageHeader from '@/app/admin/_components/PageHeader'
import NhaSanXuatForm from '../Form'
import { createNhaSanXuatAction } from '../actions'

export default function NewNhaSanXuatPage() {
  return (
    <div>
      <PageHeader title="Thêm nhà sản xuất" backHref="/admin/nha-san-xuat" />
      <NhaSanXuatForm action={createNhaSanXuatAction} />
    </div>
  )
}
