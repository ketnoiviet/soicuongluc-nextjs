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
fs.cpSync(src, dest, { recursive: true })
console.log('Copied tinymce assets to public/tinymce')
