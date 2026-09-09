// node scripts/hash-password.js "MatKhauCuaBan"
// In ra chuỗi bcrypt hash để dán vào ADMIN_PASSWORD_HASH / SUPERADMIN_PASSWORD_HASH trong .env.
// Mật khẩu gốc không được lưu lại ở đâu cả - chỉ tồn tại trong lệnh bạn vừa gõ.
const bcrypt = require('bcryptjs')

const password = process.argv[2]
if (!password) {
  console.error('Cách dùng: node scripts/hash-password.js "MatKhauCuaBan"')
  process.exit(1)
}

console.log(bcrypt.hashSync(password, 10))
