'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LienHePage() {
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
    <>
      <div className="breadcrumb">
        <div className="container">
          <ol>
            <li><Link href="/">Trang chủ</Link></li>
            <li>Liên hệ</li>
          </ol>
        </div>
      </div>

      <section className="page-section">
        <div className="container">
          <div className="section-title">
            <h2>Liên hệ với HARIFA</h2>
            <p>Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>

            {/* Form */}
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
                      placeholder="0916 666 779" />
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
                    placeholder="Tôi cần tư vấn về sợi polyester..." />
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

            {/* Thông tin */}
            <div>
              {[
                { icon: '🏢', title: 'Văn phòng TP.HCM', content: '154 Phạm Phú Thứ, P. Bảy Hiền, TP.HCM' },
                { icon: '🏢', title: 'Văn phòng Hà Nội', content: '96 Lô F4, KĐT Đại Kim - Định Công, HN' },
                { icon: '🏢', title: 'Văn phòng Đà Nẵng', content: '06 Thái Thị Bôi, Xã Nam Phước, ĐN' },
                { icon: '📦', title: 'Tổng kho', content: '27/71 Xuân Thới Thượng 59, Ấp 7, Bà Điểm, HCM' },
                { icon: '📞', title: 'Điện thoại / Zalo', content: '0916 666 779 – 0909 829 439' },
                { icon: '✉️', title: 'Email', content: 'sales@harifavn.com / info@harifavn.com' },
                { icon: '🕘', title: 'Giờ làm việc', content: 'Thứ 2 – Thứ 7: 7:30 – 17:30' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--bg-gray)' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-dark)' }}>{item.content}</div>
                  </div>
                </div>
              ))}

              {/* Google Map */}
              <div style={{ marginTop: 20, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2!2d106.63!3d10.79!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1svi!2svn!4v1620000000000"
                  width="100%" height="220" style={{ border: 0, display: 'block' }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="HARIFA Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
