import PageHeader from '@/app/admin/_components/PageHeader'
import DoiTacForm from '../Form'
import { createDoiTacAction } from '../actions'

export default function NewDoiTacPage() {
  return (
    <div>
      <PageHeader title="Thêm đối tác / khách hàng" backHref="/admin/doi-tac-khach-hang" />
      <DoiTacForm action={createDoiTacAction} />
    </div>
  )
}
