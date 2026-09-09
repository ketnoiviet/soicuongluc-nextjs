import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

// Escape HTML entity trước khi ghép vào template email - dữ liệu form liên hệ đến từ người
// dùng ẩn danh chưa xác thực, không được tin tưởng khi chèn thẳng vào chuỗi HTML gửi qua nodemailer.
function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: Request) {
  try {
    // Chặn spam/mail-bombing từ 1 nguồn: tối đa 5 lần gửi / giờ / IP - đủ cho nhu cầu liên hệ
    // thật (kể cả gửi lại do gõ nhầm) nhưng chặn được script tự động dội liên tục.
    const ip = await getClientIp(request.headers)
    const limit = checkRateLimit(`contact:ip:${ip}`, 5, 60 * 60 * 1000)
    if (!limit.ok) {
      return NextResponse.json({ error: 'Bạn đã gửi liên hệ quá nhiều lần. Vui lòng thử lại sau.' }, { status: 429 })
    }

    const body = await request.json()
    const { tenKH, dienThoai, email, diaChi, tieuDe, noiDung, idLoai } = body

    if (!tenKH || !dienThoai || !noiDung) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }

    // Lưu vào database
    const record = await prisma.contactSubmission.create({
      data: {
        fullName: tenKH, phoneNumber: dienThoai, email: email || null,
        address: diaChi || null, subject: tieuDe || 'Liên hệ từ website',
        message: noiDung, inquiryType: idLoai === 2 ? 'QUOTE_REQUEST' : 'GENERAL_CONTACT', status: 'PENDING',
        createdAt: new Date(),
      },
    })

    // Gửi email thông báo (nếu cấu hình SMTP)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = await import('nodemailer')
        const transporter = nodemailer.default.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        })
        const safe = {
          tenKH: escapeHtml(tenKH),
          dienThoai: escapeHtml(dienThoai),
          email: email ? escapeHtml(email) : '',
          diaChi: diaChi ? escapeHtml(diaChi) : '',
          tieuDe: tieuDe ? escapeHtml(tieuDe) : '',
          noiDung: escapeHtml(noiDung),
        }
        const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Website'
        await transporter.sendMail({
          from: `"${siteName}" <${process.env.SMTP_USER}>`,
          to: process.env.EMAIL_TO || process.env.SMTP_USER,
          subject: `[Website] ${safe.tieuDe || 'Liên hệ mới'} - ${safe.tenKH}`,
          html: `
            <h2 style="color:#1a5276">Thông tin liên hệ mới từ ${siteName}</h2>
            <table style="border-collapse:collapse;width:100%;font-size:14px">
              <tr><td style="padding:8px;background:#f5f7fa;font-weight:700;border:1px solid #dde1e7;width:140px">Họ tên</td><td style="padding:8px;border:1px solid #dde1e7">${safe.tenKH}</td></tr>
              <tr><td style="padding:8px;background:#f5f7fa;font-weight:700;border:1px solid #dde1e7">Điện thoại</td><td style="padding:8px;border:1px solid #dde1e7"><a href="tel:${safe.dienThoai}">${safe.dienThoai}</a></td></tr>
              <tr><td style="padding:8px;background:#f5f7fa;font-weight:700;border:1px solid #dde1e7">Email</td><td style="padding:8px;border:1px solid #dde1e7">${safe.email || '—'}</td></tr>
              <tr><td style="padding:8px;background:#f5f7fa;font-weight:700;border:1px solid #dde1e7">Địa chỉ</td><td style="padding:8px;border:1px solid #dde1e7">${safe.diaChi || '—'}</td></tr>
              <tr><td style="padding:8px;background:#f5f7fa;font-weight:700;border:1px solid #dde1e7">Tiêu đề</td><td style="padding:8px;border:1px solid #dde1e7">${safe.tieuDe || '—'}</td></tr>
              <tr><td style="padding:8px;background:#f5f7fa;font-weight:700;border:1px solid #dde1e7">Nội dung</td><td style="padding:8px;border:1px solid #dde1e7;white-space:pre-wrap">${safe.noiDung}</td></tr>
            </table>
            <p style="color:#888;font-size:12px;margin-top:16px">Gửi lúc: ${new Date().toLocaleString('vi-VN')} | ID: #${record.id}</p>
          `,
        })
      } catch (mailErr) {
        console.error('Email error (non-fatal):', mailErr)
        // Không fail request nếu email lỗi - đã lưu DB rồi
      }
    }

    return NextResponse.json({ success: true, id: record.id })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}

export async function GET() {
  // Endpoint đơn giản để kiểm tra (không public data)
  return NextResponse.json({ status: 'ok' })
}
