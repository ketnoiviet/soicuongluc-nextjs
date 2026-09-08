import PageHeader from '@/app/admin/_components/PageHeader'
import PanelForm from '../Form'
import { createPanelAction } from '../actions'

export default function NewPanelPage() {
  return (
    <div>
      <PageHeader title="Thêm panel" />
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <PanelForm action={createPanelAction} />
      </div>
    </div>
  )
}
