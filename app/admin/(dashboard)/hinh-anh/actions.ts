'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { deleteUploadedFile } from '@/lib/upload'
import { requireAdminForPath } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { ContentStatus } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/hinh-anh')
}

function readForm(formData: FormData) {
  return {
    title: String(formData.get('title') || '').trim(),
    sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
    status: String(formData.get('status') || 'PUBLISHED') as ContentStatus,
  }
}

export async function createAlbumAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.title) return { error: 'Tên album là bắt buộc.' }

  const album = await prisma.galleryAlbum.create({ data })

  revalidatePath('/admin/hinh-anh')
  redirect(`/admin/hinh-anh/${album.id}`)
}

export async function updateAlbumAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.title) return { error: 'Tên album là bắt buộc.' }

  await prisma.galleryAlbum.update({ where: { id }, data })

  revalidatePath('/admin/hinh-anh')
  revalidatePath(`/admin/hinh-anh/${id}`)
  return { success: 'Đã lưu thay đổi.' }
}

export async function deleteAlbumAction(id: number) {
  await requireAdmin()
  const album = await prisma.galleryAlbum.findUnique({ where: { id }, include: { photos: true } })
  if (!album) return
  // Xoá file ảnh trên đĩa trước khi xoá album - DB dùng onDelete: Cascade nên riêng bản ghi
  // GalleryPhoto sẽ tự mất theo, nhưng file vật lý thì phải tự dọn.
  for (const photo of album.photos) await deleteUploadedFile(photo.imageUrl)
  await prisma.galleryAlbum.delete({ where: { id } })
  revalidatePath('/admin/hinh-anh')
}

export async function deletePhotoAction(albumId: number, photoId: number) {
  await requireAdmin()
  const deleted = await prisma.galleryPhoto.delete({ where: { id: photoId } })
  await deleteUploadedFile(deleted.imageUrl)
  revalidatePath(`/admin/hinh-anh/${albumId}`)
}
