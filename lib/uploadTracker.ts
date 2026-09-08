'use client'

import { useSyncExternalStore } from 'react'

// Đếm số lượt upload ảnh TinyMCE (paste/print-screen/drag) đang chạy dở trên toàn trang.
// paste_data_images:true khiến ảnh dán được TinyMCE chèn ngay dưới dạng blob: rồi upload ngầm -
// nếu form submit trước khi upload xong, hidden input có thể lưu lại blob: URL không hợp lệ.
// SubmitButton dùng useUploadPending() để tự khoá nút submit trong lúc còn upload dở.
let pending = 0
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

export function beginUpload() {
  pending += 1
  notify()
}

export function endUpload() {
  pending = Math.max(0, pending - 1)
  notify()
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot() {
  return pending
}

function getServerSnapshot() {
  return 0
}

export function useUploadPending(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) > 0
}
