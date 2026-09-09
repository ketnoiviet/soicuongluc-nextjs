import PageHeader from '@/app/admin/_components/PageHeader'
import VisaoForm from '../Form'
import { createVisaoAction } from '../actions'

export default function NewVisaoPage() {
  return (
    <div>
      <PageHeader title="Thêm mục Vì sao chọn chúng tôi" backHref="/admin/vi-sao-chon-chung-toi" />
      <VisaoForm action={createVisaoAction} />
    </div>
  )
}
