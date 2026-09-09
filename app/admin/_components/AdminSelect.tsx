'use client'

import { Children, isValidElement, useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// Thay cho <select> gốc trong toàn bộ /admin: popup của <select> gốc trên Chrome/Windows vẽ
// theo theme HỆ ĐIỀU HÀNH (prefers-color-scheme), bỏ qua hẳn `color-scheme` mà trang web khai
// báo trong CSS - đã kiểm chứng trực tiếp (ép prefers-color-scheme:dark thì popup tối đúng,
// dù CSS trang không đổi gì) nên không có cách nào chỉnh riêng bằng CSS. AdminSelect dùng Radix
// UI (@radix-ui/react-select, đã có sẵn trong dự án) để tự vẽ popup bằng DOM + CSS của chính
// trang, không phụ thuộc theme OS nữa. Xem memory "admin-darkmode-select-fix".
//
// API cố tình giữ giống hệt <select>: name + defaultValue (hoặc value có kiểm soát) + children
// là các <option value="...">Label</option> - đổi 1 dòng tại chỗ dùng, không cần viết lại theo
// API compound-component gốc của Radix (Select.Trigger/Select.Content/Select.Item...) ở từng nơi.
//
// Radix Select không cho phép Item có value="" (dành riêng để biểu diễn "chưa chọn gì") - trong
// khi rất nhiều chỗ ở đây dùng <option value="">— Chọn... —</option> làm 1 lựa chọn thật sự
// (không phải placeholder). Nên value "" được ánh xạ sang sentinel EMPTY_VALUE chỉ ở bên trong
// Radix, và luôn dịch ngược lại thành "" trước khi ghi vào <input type="hidden"> thật sự được
// submit - nơi gọi formData.get(name) ở mọi action không cần đổi gì.
const EMPTY_VALUE = '__admin_select_empty__'

type OptionEl = ReactElement<{ value?: string | number; children?: ReactNode; disabled?: boolean }>

function parseOptions(children: ReactNode) {
  const options: { value: string; label: ReactNode; disabled?: boolean }[] = []
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === 'option') {
      const el = child as OptionEl
      options.push({
        value: el.props.value === undefined ? '' : String(el.props.value),
        label: el.props.children,
        disabled: el.props.disabled,
      })
    }
  })
  return options
}

export default function AdminSelect({
  name,
  defaultValue,
  value,
  onChange,
  required,
  disabled,
  className,
  children,
}: {
  name?: string
  defaultValue?: string | number
  value?: string | number
  onChange?: (value: string) => void
  required?: boolean
  disabled?: boolean
  className?: string
  children: ReactNode
}) {
  const options = parseOptions(children)
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue !== undefined ? String(defaultValue) : '')
  const currentValue = isControlled ? String(value) : internalValue

  const handleChange = (raw: string) => {
    const next = raw === EMPTY_VALUE ? '' : raw
    if (!isControlled) setInternalValue(next)
    onChange?.(next)
  }

  // SelectPrimitive.Portal (mặc định) render Content thẳng vào cuối <body>, thoát khỏi
  // .admin-root - nơi mọi biến CSS --admin-* (--admin-card, --admin-text...) được định nghĩa.
  // Biến CSS chỉ thừa kế theo cây DOM thật, không theo cây component React, nên portal ra
  // ngoài .admin-root làm mọi lớp bg-admin-*/text-admin-* trong popup không thấy giá trị biến
  // nào cả (render trong suốt) - đã bắt được lỗi này qua getComputedStyle khi kiểm tra trực
  // tiếp. Trỏ container của Portal vào .admin-root để popup vẫn nằm trong đúng phạm vi biến.
  const anchorRef = useRef<HTMLDivElement>(null)
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setPortalContainer(anchorRef.current?.closest('.admin-root') as HTMLElement | null)
  }, [])

  return (
    <div ref={anchorRef} style={{ display: 'contents' }}>
      {name && <input type="hidden" name={name} value={currentValue} required={required} />}
      <SelectPrimitive.Root value={currentValue === '' ? EMPTY_VALUE : currentValue} onValueChange={handleChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          className={cn(
            'flex h-10 w-full items-center justify-between gap-2 rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 text-sm text-admin-text outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5',
            className
          )}
        >
          <span className="truncate text-left">
            <SelectPrimitive.Value />
          </span>
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="size-4 shrink-0 text-admin-text-3" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal container={portalContainer ?? undefined}>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className="z-50 max-h-[--radix-select-content-available-height] w-[--radix-select-trigger-width] overflow-y-auto rounded-admin-sm border border-admin-border/20 bg-admin-card text-admin-text shadow-lg"
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value === '' ? EMPTY_VALUE : opt.value}
                  disabled={opt.disabled}
                  className="relative flex cursor-pointer select-none items-center rounded-admin-sm py-2 pl-3 pr-7 text-sm text-admin-text outline-none data-[highlighted]:bg-admin-primary/10 data-[highlighted]:text-admin-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center">
                    <Check className="size-3.5" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  )
}
