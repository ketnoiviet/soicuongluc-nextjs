import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tenKH, dienThoai, email, diaChi, tieuDe, noiDung, idLoai } = body

    if (!tenKH || !dienThoai || !noiDung) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }

    // Lưu vào database
    const record = await prisma.lienHeKH.create({
      data: {
        tenKH, dienThoai, email: email || null,
        diaChi: diaChi || null, tieuDe: tieuDe || 'Liên hệ từ website',
        noiDung, idLoai: idLoai || 1, status: 0,
        ngay: new Date(),
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
        await transporter.sendMail({
          from: `"soicuongluc.com" <${process.env.SMTP_USER}>`,
          to: process.env.EMAIL_TO || 'sales@harifavn.com',
          subject: `[Website] ${tieuDe || 'Liên hệ mới'} - ${tenKH}`,
          html: `
            <h2 style="color:#1a5276">Thông tin liên hệ mới từ soicuongluc.com</h2>
            <table style="border-collapse:collapse;width:100%;font-size:14px">
              <tr><td style="padding:8px;background:#f5f7fa;font-weight:700;border:1px solid #dde1e7;width:140px">Họ tên</td><td style="padding:8px;border:1px solid #dde1e7">${tenKH}</td></tr>
              <tr><td style="padding:8px;background:#f5f7fa;font-weight:700;border:1px solid #dde1e7">Điện thoại</td><td style="padding:8px;border:1px solid #dde1e7"><a href="tel:${dienThoai}">${dienThoai}</a></td></tr>
              <tr><td style="padding:8px;background:#f5f7fa;font-weight:700;border:1px solid #dde1e7">Email</td><td style="padding:8px;border:1px solid #dde1e7">${email || '—'}</td></tr>
              <tr><td style="padding:8px;background:#f5f7fa;font-weight:700;border:1px solid #dde1e7">Địa chỉ</td><td style="padding:8px;border:1px solid #dde1e7">${diaChi || '—'}</td></tr>
              <tr><td style="padding:8px;background:#f5f7fa;font-weight:700;border:1px solid #dde1e7">Tiêu đề</td><td style="padding:8px;border:1px solid #dde1e7">${tieuDe || '—'}</td></tr>
              <tr><td style="padding:8px;background:#f5f7fa;font-weight:700;border:1px solid #dde1e7">Nội dung</td><td style="padding:8px;border:1px solid #dde1e7;white-space:pre-wrap">${noiDung}</td></tr>
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
