'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2, Play, X } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'
import { getEmbedUrl } from '@/lib/video'
import { VIDEO_SOURCE_LABELS, type VideoSource } from '@/lib/enums'
import GlassCard from '@/app/admin/_components/GlassCard'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'

type VideoItem = {
  id: number
  title: string | null
  thumbnailUrl: string | null
  videoUrl: string
  videoSource: string
  sortOrder: number
  deleteAction: () => Promise<void>
}

export default function VideoGrid({ videos }: { videos: VideoItem[] }) {
  const [playing, setPlaying] = useState<VideoItem | null>(null)
  const embedUrl = playing ? getEmbedUrl(playing.videoUrl, playing.videoSource as VideoSource) : null

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((video) => (
          <GlassCard key={video.id} className="overflow-hidden p-0">
            <button
              type="button"
              onClick={() => setPlaying(video)}
              className="group relative block aspect-video w-full bg-admin-text-3/10"
            >
              {video.thumbnailUrl ? (
                <Image src={getImageUrl(video.thumbnailUrl)} alt={video.title || ''} fill className="object-cover" sizes="320px" />
              ) : (
                <div className="flex size-full items-center justify-center text-admin-text-3">
                  <Play className="size-8" />
                </div>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex size-11 items-center justify-center rounded-full bg-white/90 text-admin-primary">
                  <Play className="size-5 fill-current" />
                </span>
              </span>
              <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                {VIDEO_SOURCE_LABELS[video.videoSource as VideoSource] || video.videoSource}
              </span>
            </button>
            <div className="p-3">
              <p className="truncate text-sm font-semibold text-admin-text">{video.title || `Video #${video.id}`}</p>
              <p className="truncate text-xs text-admin-text-3">Thứ tự: {video.sortOrder}</p>
              <div className="mt-2 flex justify-end gap-2">
                <Link
                  href={`/admin/videos/${video.id}`}
                  className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                >
                  <Pencil className="size-3.5" />
                </Link>
                <ConfirmDeleteButton
                  action={video.deleteAction}
                  confirmMessage="Xóa video này?"
                  label={<Trash2 className="size-3.5" />}
                  pendingLabel="…"
                  className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-rose/40 hover:text-admin-rose disabled:opacity-50"
                />
              </div>
            </div>
          </GlassCard>
        ))}
        {videos.length === 0 && (
          <GlassCard className="col-span-full py-10 text-center text-admin-text-3">Chưa có video nào.</GlassCard>
        )}
      </div>

      {playing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPlaying(null)}
        >
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPlaying(null)}
              aria-label="Đóng"
              className="absolute -top-10 right-0 flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
            <div className="relative aspect-video w-full overflow-hidden rounded-admin-md bg-black">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 size-full"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex size-full items-center justify-center p-6 text-center text-sm text-white/80">
                  Không thể nhúng xem trước video này.{' '}
                  <a href={playing.videoUrl} target="_blank" rel="noopener" className="ml-1 underline">
                    Mở link gốc
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
