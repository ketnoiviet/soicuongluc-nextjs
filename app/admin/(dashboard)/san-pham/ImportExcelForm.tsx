import ActionForm from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import { importSanPhamExcelAction } from './actions'

export default function ImportExcelForm() {
  return (
    <ActionForm action={importSanPhamExcelAction} className="flex flex-wrap items-center gap-3">
      <input
        type="file"
        name="file"
        accept=".xlsx"
        required
        className="text-sm text-admin-text-2 file:mr-2 file:rounded-admin-sm file:border-0 file:bg-admin-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-admin-primary"
      />
      <SubmitButton
        pendingLabel="Đang nhập..."
        className="h-10 rounded-admin-sm border border-admin-border/20 bg-white/70 px-4 text-sm font-medium text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary disabled:pointer-events-none disabled:opacity-60 dark:bg-white/5"
      >
        Nhập Excel
      </SubmitButton>
    </ActionForm>
  )
}
