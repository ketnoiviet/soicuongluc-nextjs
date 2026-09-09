// Copy self-hosted TinyMCE assets from node_modules into public/ so the
// admin editor can load them locally (no cloud API key / domain nag).
const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, '..', 'node_modules', 'tinymce')
const dest = path.join(__dirname, '..', 'public', 'tinymce')

if (!fs.existsSync(src)) {
  console.warn('tinymce package not found in node_modules, skipping copy.')
  process.exit(0)
}

fs.rmSync(dest, { recursive: true, force: true })
// dereference: true - node_modules/tinymce có thể là symlink (pnpm trỏ vào .pnpm store), cần
// copy nội dung file thật thay vì tạo lại symlink ở public/tinymce (tạo symlink trên Windows
// cần quyền admin/Developer Mode, không cần thiết ở đây).
fs.cpSync(src, dest, { recursive: true, dereference: true })
console.log('Copied tinymce assets to public/tinymce')
