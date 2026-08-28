import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idLoai = searchParams.get('idLoai')
  const tieubieu = searchParams.get('tieubieu')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: Record<string, unknown> = { hieuLuc: 1, hienThi: 1 }
  if (idLoai) where.idLoai = parseInt(idLoai)
  if (tieubieu === '1') where.spTieuBieu = 1

  const products = await prisma.sanPham.findMany({
    where,
    orderBy: { thuTu: 'asc' },
    take: limit,
    select: { id: true, tenSP: true, hinhNho: true, link: true, idLoai: true, spTieuBieu: true, spMoi: true, tomTat: true },
  })

  return NextResponse.json(products)
}
