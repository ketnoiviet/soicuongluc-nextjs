import PageHeader from '@/app/admin/_components/PageHeader'
import PanelForm from '../Form'
import { createPanelAction } from '../actions'

export default function NewPanelPage() {
  return (
    <div>
      <PageHeader title="Thêm panel" backHref="/admin/panel" />
      <PanelForm action={createPanelAction} />
    </div>
  )
}
