import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idLoai = searchParams.get('idLoai')
  const tieubieu = searchParams.get('tieubieu')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: Prisma.ProductWhereInput = { status: 'PUBLISHED' }
  if (idLoai) where.categoryId = parseInt(idLoai)
  if (tieubieu === '1') where.isFeatured = true

  const products = await prisma.product.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    take: limit,
    select: { id: true, name: true, thumbnailUrl: true, slug: true, categoryId: true, isFeatured: true, isNew: true, shortDescription: true },
  })

  return NextResponse.json(products)
}
