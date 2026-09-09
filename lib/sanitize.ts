import 'server-only'
import sanitizeHtml from 'sanitize-html'

// Allowlist khớp đúng với những gì RichTextEditor.tsx (TinyMCE) cho phép tạo ra qua toolbar/
// plugin đang bật (bold/italic/underline, forecolor/backcolor, align, list, link, image, media,
// table, blocks) - không rộng hơn nhu cầu thật, để không vô tình mở đường cho thẻ/attribute nguy hiểm.
// Bắt buộc dùng cho MỌI field richtext trước khi ghi vào DB: TinyMCE có plugin "code" cho phép
// dán thẳng HTML thô qua UI bình thường (không cần bypass gì), nên không thể tin nội dung nhận
// được từ form chỉ vì nó đi qua trình soạn thảo.
const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'img',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
    'span', 'div', 'blockquote', 'pre', 'code',
    'iframe',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height', 'style'],
    iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder'],
    td: ['colspan', 'rowspan'],
    th: ['colspan', 'rowspan'],
    '*': ['style', 'class'],
  },
  allowedStyles: {
    '*': {
      color: [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/],
      'background-color': [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/],
      'text-align': [/^(left|right|center|justify)$/],
    },
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  // Media plugin của TinyMCE nhúng video qua <iframe> - chỉ tin các domain video hợp pháp,
  // chặn iframe trỏ tới URL tuỳ ý (nguy cơ clickjacking/phishing nếu cho phép mọi domain).
  allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
  },
}

/**
 * Làm sạch 1 chuỗi HTML richtext trước khi lưu DB - loại bỏ <script>, thuộc tính on*,
 * href/src dạng javascript:, và mọi thẻ/attribute ngoài allowlist ở trên. Gọi hàm này ở MỌI
 * action ghi field richtext (contentHtml/descriptionHtml/answerHtml/shortDescription...),
 * không tin trực tiếp giá trị formData dù đã đi qua TinyMCE ở phía client.
 */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, RICH_TEXT_OPTIONS)
}
