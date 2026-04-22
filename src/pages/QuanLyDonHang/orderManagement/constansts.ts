import { OrderStatus, Product } from '@/services/QuanLyDonHang/order/typing.d';

export const ORDER_STATUS_TAGS: Record<OrderStatus, string> = {
  [OrderStatus.CHUA_XAC_NHAN]: 'processing',
  [OrderStatus.DANG_GIAO]: 'warning',
  [OrderStatus.HOAN_THANH]: 'success',
  [OrderStatus.HUY]: 'error',
};

export const ORDER_STATUS_OPTIONS = [
  { label: 'Chờ xác nhận', value: OrderStatus.CHUA_XAC_NHAN },
  { label: 'Đang giao', value: OrderStatus.DANG_GIAO },
  { label: 'Hoàn thành', value: OrderStatus.HOAN_THANH },
  { label: 'Hủy', value: OrderStatus.HUY },
];

export const CUSTOMERS_MOCK = [
  { label: 'Nguyễn Văn A', value: 'Nguyễn Văn A' },
  { label: 'Trần Thị B', value: 'Trần Thị B' },
  { label: 'Lê Văn C', value: 'Lê Văn C' },
  { label: 'Phạm Thị D', value: 'Phạm Thị D' },
  { label: 'Hoàng Văn E', value: 'Hoàng Văn E' },
];

export const PRODUCTS_MOCK: Product[] = [
  { id: 'SP001', name: 'Điện thoại iPhone 15 Pro Max', price: 34990000 },
  { id: 'SP002', name: 'Laptop MacBook Pro M3', price: 42000000 },
  { id: 'SP003', name: 'Samsung Galaxy S24 Ultra', price: 30000000 },
  { id: 'SP004', name: 'Tai nghe AirPods Pro 2', price: 6500000 },
  { id: 'SP005', name: 'Đồng hồ Apple Watch Series 9', price: 10500000 },
  { id: 'SP006', name: 'Chuột Logitech MX Master 3S', price: 2500000 },
];
