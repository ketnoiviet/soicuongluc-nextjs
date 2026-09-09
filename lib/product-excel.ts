// Định nghĩa cột Excel xuất/nhập sản phẩm dùng chung giữa route export (ghi cột theo đây)
// và action import (đọc theo đúng thứ tự cột này, xem san-pham/actions.ts).
export const PRODUCT_EXCEL_COLUMNS = [
  { header: 'Tên sản phẩm', key: 'name', width: 36 },
  { header: 'Mã số', key: 'sku', width: 16 },
  { header: 'Giá bán', key: 'price', width: 14 },
  { header: 'Đơn vị tính', key: 'unit', width: 14 },
  { header: 'Giá khuyến mãi', key: 'salePrice', width: 16 },
  { header: 'Danh mục', key: 'categoryName', width: 28 },
  { header: 'Tình trạng', key: 'statusLabel', width: 16 },
] as const
