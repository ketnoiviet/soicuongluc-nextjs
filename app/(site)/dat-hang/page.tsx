'use client'
import { useState } from 'react'
import Link from 'next/link'

const PRODUCT_CATEGORIES = [
  'Sợi Polyester Tenacity Yarn',
  'Sợi Polyester Modulus Shrinkage Yarn',
  'Sợi Polyester Shrinkage Yarn',
  'Sợi Polyester Adhesive Activated Yarn',
  'Sợi Polyester Wick Yarn',
  'Sợi Nylon 6 Tenacity Yarn',
  'Sợi Nylon 66 Tenacity Yarn',
  'Sợi Nylon Chainlon',
  'Sợi carbon mô đun chuẩn',
  'Sợi carbon mô đun trung gian',
  'Sợi carbon độ bền kéo cực cao',
  'Sợi Aramid (ALKEX)',
  'PET và NYLON Tire Cord',
  'Steel Cord',
  'Bead wire',
  'Khác (ghi rõ trong nội dung)',
]

export default function DatHangPage() {
  const [form, setForm] = useState({
    tenKH: '', dienThoai: '', email: '', diaChi: '',
    tieuDe: 'Yêu cầu báo giá', noiDung: '',
    sanPham: '', soLuong: '', donVi: 'kg',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const noiDungFull = `Sản phẩm: ${form.sanPham}\nSố lượng: ${form.soLuong} ${form.donVi}\nĐịa chỉ: ${form.diaChi}\n\nGhi chú:\n${form.noiDung}`
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenKH: form.tenKH, dienThoai: form.dienThoai, email: form.email, diaChi: form.diaChi, tieuDe: form.tieuDe, noiDung: noiDungFull, idLoai: 2 }),
      })
      setStatus(res.ok ? 'ok' : 'err')
      if (res.ok) setForm({ tenKH: '', dienThoai: '', email: '', diaChi: '', tieuDe: 'Yêu cầu báo giá', noiDung: '', sanPham: '', soLuong: '', donVi: 'kg' })
    } catch { setStatus('err') }
  }

  return (
    <>
      <div className="breadcrumb">
        <div className="container">
          <ol>
            <li><Link href="/">Trang chủ</Link></li>
            <li>Nhận báo giá</li>
          </ol>
        </div>
      </div>

      <section className="page-section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="section-title">
            <h2>Yêu cầu Báo giá</h2>
            <p>Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 2 giờ làm việc</p>
          </div>

          {status === 'ok' && (
            <div className="alert alert-success" style={{ marginBottom: 24 }}>
              ✅ Yêu cầu báo giá đã được gửi thành công! Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
            </div>
          )}
          {status === 'err' && (
            <div className="alert alert-error" style={{ marginBottom: 24 }}>
              ❌ Gửi thất bại. Vui lòng gọi trực tiếp: <a href="tel:0916666779" style={{ fontWeight: 700 }}>0916 666 779</a>
            </div>
          )}

          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 32 }}>
            <form onSubmit={handleSubmit}>
              {/* Thông tin liên hệ */}
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid var(--bg-gray)' }}>
                📋 Thông tin liên hệ
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Họ tên *</label>
                  <input className="form-control" required value={form.tenKH}
                    onChange={e => setForm(f => ({ ...f, tenKH: e.target.value }))}
                    placeholder="Họ và tên đầy đủ" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Số điện thoại *</label>
                  <input className="form-control" required value={form.dienThoai}
                    onChange={e => setForm(f => ({ ...f, dienThoai: e.target.value }))}
                    placeholder="0916 666 779" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@company.com" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Tên công ty / Địa chỉ</label>
                  <input className="form-control" value={form.diaChi}
                    onChange={e => setForm(f => ({ ...f, diaChi: e.target.value }))}
                    placeholder="Công ty ABC, TP.HCM" />
                </div>
              </div>

              {/* Thông tin sản phẩm */}
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 16, marginTop: 24, paddingBottom: 8, borderBottom: '2px solid var(--bg-gray)' }}>
                📦 Sản phẩm cần báo giá
              </h3>
              <div className="form-group">
                <label className="form-label">Loại sản phẩm *</label>
                <select className="form-control" required value={form.sanPham}
                  onChange={e => setForm(f => ({ ...f, sanPham: e.target.value }))}>
                  <option value="">-- Chọn sản phẩm --</option>
                  {PRODUCT_CATEGORIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 16 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Số lượng cần mua</label>
                  <input className="form-control" type="number" min="1" value={form.soLuong}
                    onChange={e => setForm(f => ({ ...f, soLuong: e.target.value }))}
                    placeholder="100" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Đơn vị</label>
                  <select className="form-control" value={form.donVi}
                    onChange={e => setForm(f => ({ ...f, donVi: e.target.value }))}>
                    <option value="kg">kg</option>
                    <option value="tấn">tấn</option>
                    <option value="cuộn">cuộn</option>
                    <option value="m">m</option>
                    <option value="hộp">hộp</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Thông tin thêm / Yêu cầu kỹ thuật</label>
                <textarea className="form-control" rows={5} value={form.noiDung}
                  onChange={e => setForm(f => ({ ...f, noiDung: e.target.value }))}
                  placeholder="Mô tả chi tiết yêu cầu: chỉ số denier, số lượng, thông số kỹ thuật, ứng dụng cụ thể..." />
              </div>
              <button className="btn-submit" type="submit" disabled={status === 'sending'}
                style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }}>
                {status === 'sending' ? '⏳ Đang gửi yêu cầu...' : '📨 Gửi yêu cầu báo giá'}
              </button>
            </form>
          </div>

          {/* Hotline */}
          <div style={{ marginTop: 24, background: 'var(--primary)', color: '#fff', borderRadius: 10, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Cần hỗ trợ ngay?</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Gọi trực tiếp để được tư vấn và báo giá nhanh nhất</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="tel:0916666779" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: 6, fontWeight: 700, fontSize: 14 }}>
                📞 0916 666 779
              </a>
              <a href="https://zalo.me/0916666779" target="_blank" rel="noopener"
                style={{ background: '#0068ff', color: '#fff', padding: '10px 20px', borderRadius: 6, fontWeight: 700, fontSize: 14 }}>
                🔵 Zalo
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
