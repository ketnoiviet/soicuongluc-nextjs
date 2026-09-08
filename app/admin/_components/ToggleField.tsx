export default function ToggleField({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string
  label: string
  description?: string
  defaultChecked?: boolean
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-1.5">
      <span className="min-w-0">
        <span className="block text-sm font-medium text-admin-text">{label}</span>
        {description && <span className="block text-xs text-admin-text-3">{description}</span>}
      </span>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full bg-admin-text-3/25 transition-colors peer-checked:bg-admin-primary peer-focus-visible:ring-2 peer-focus-visible:ring-admin-primary/40 peer-focus-visible:ring-offset-2" />
        <span className="absolute left-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  )
}
