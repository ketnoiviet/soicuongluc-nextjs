'use client'
import { useState } from 'react'

export default function LienHeForm() {
  const [form, setForm] = useState({ tenKH: '', dienThoai: '', email: '', tieuDe: '', noiDung: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, idLoai: 1 }) })
      setStatus(res.ok ? 'ok' : 'err')
      if (res.ok) setForm({ tenKH: '', dienThoai: '', email: '', tieuDe: '', noiDung: '' })
    } catch { setStatus('err') }
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--primary)', marginBottom: 20 }}>Gửi tin nhắn</h3>
      {status === 'ok' && <div className="alert alert-success">✅ Gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.</div>}
      {status === 'err' && <div className="alert alert-error">❌ Có lỗi xảy ra. Vui lòng thử lại hoặc gọi trực tiếp.</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Họ tên *</label>
            <input className="form-control" required value={form.tenKH}
              onChange={e => setForm(f => ({ ...f, tenKH: e.target.value }))}
              placeholder="Nguyễn Văn A" />
          </div>
          <div className="form-group">
            <label className="form-label">Điện thoại *</label>
            <input className="form-control" required value={form.dienThoai}
              onChange={e => setForm(f => ({ ...f, dienThoai: e.target.value }))}
              placeholder="09xx xxx xxx" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-control" type="email" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="email@domain.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Tiêu đề</label>
          <input className="form-control" value={form.tieuDe}
            onChange={e => setForm(f => ({ ...f, tieuDe: e.target.value }))}
            placeholder="Nội dung cần tư vấn..." />
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung *</label>
          <textarea className="form-control" rows={5} required value={form.noiDung}
            onChange={e => setForm(f => ({ ...f, noiDung: e.target.value }))}
            placeholder="Mô tả nhu cầu của bạn..." />
        </div>
        <button className="btn-submit" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? '⏳ Đang gửi...' : '📨 Gửi tin nhắn'}
        </button>
      </form>
    </div>
  )
}
