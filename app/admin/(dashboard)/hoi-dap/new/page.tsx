import PageHeader from '@/app/admin/_components/PageHeader'
import FaqForm from '../Form'
import { createFaqAction } from '../actions'

export default function NewFaqPage() {
  return (
    <div>
      <PageHeader title="Thêm câu hỏi" backHref="/admin/hoi-dap" />
      <FaqForm action={createFaqAction} />
    </div>
  )
}
