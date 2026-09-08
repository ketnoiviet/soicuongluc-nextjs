import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
      <div>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>404</h1>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 12 }}>Trang không tồn tại</h2>
        <p style={{ color: 'var(--text-gray)', marginBottom: 24 }}>Trang bạn tìm kiếm có thể đã bị xóa hoặc địa chỉ URL không đúng.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-detail" style={{ padding: '10px 24px', fontSize: 14 }}>🏠 Về trang chủ</Link>
          <Link href="/san-pham/soi-polyester-cuong-luc" className="btn-detail" style={{ padding: '10px 24px', fontSize: 14, background: 'var(--accent)' }}>
            📦 Xem sản phẩm
          </Link>
        </div>
      </div>
    </div>
  )
}
