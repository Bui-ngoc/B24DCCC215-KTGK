export enum OrderStatus {
  CHUA_XAC_NHAN = 'Chờ xác nhận',
  DANG_GIAO = 'Đang giao',
  HOAN_THANH = 'Hoàn thành',
  HUY = 'Hủy',
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string; 
  orderCode: string;
  customerName: string;
  orderDate: string; 
  totalAmount: number;
  status: OrderStatus;
  products: OrderProduct[];
}
