import { NextRequest, NextResponse } from 'next/server'
import { checkAdminPathAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PRODUCT_EXCEL_COLUMNS } from '@/lib/product-excel'
import { CONTENT_STATUS_LABELS, type ContentStatus } from '@/lib/enums'
import type { Column } from 'exceljs'

// Xuất Excel danh sách sản phẩm - áp dụng đúng bộ lọc hiện tại trên danh sách (q/loai/trangthai/nsx)
// qua query string, để "Xuất Excel" xuất đúng những gì admin đang xem, không phải luôn toàn bộ.
export async function GET(req: NextRequest) {
  const access = await checkAdminPathAccess('/admin/san-pham')
  if (!access.ok) return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: access.reason === 'unauthenticated' ? 401 : 403 })

  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')?.trim() || ''
  const categoryId = searchParams.get('loai') ? Number(searchParams.get('loai')) : undefined
  const status = searchParams.get('trangthai') || undefined
  const supplierId = searchParams.get('nsx') ? Number(searchParams.get('nsx')) : undefined

  const items = await prisma.product.findMany({
    where: {
      ...(q ? { name: { contains: q } } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(status ? { status } : {}),
      ...(supplierId ? { supplierId } : {}),
    },
    orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }],
    include: { category: true },
  })

  const ExcelJS = (await import('exceljs')).default
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Sản phẩm')
  sheet.columns = PRODUCT_EXCEL_COLUMNS as unknown as Column[]
  sheet.getRow(1).font = { bold: true }

  for (const p of items) {
    sheet.addRow({
      name: p.name,
      sku: p.sku || '',
      price: p.price ?? '',
      unit: p.unit || '',
      salePrice: p.salePrice ?? '',
      categoryName: p.category?.name || '',
      statusLabel: CONTENT_STATUS_LABELS[p.status as ContentStatus] || p.status,
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="san-pham-${Date.now()}.xlsx"`,
    },
  })
}
