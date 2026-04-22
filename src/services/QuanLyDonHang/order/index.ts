import { Order, OrderStatus } from './typing.d';

const LOCAL_STORAGE_KEY = 'quanlydonhang_orders';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Lấy danh sách  đơn hàng từ local storage
const getOrdersFromStorage = (): Order[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Lưu danh sách đơn hàng vào local storage
const saveOrdersToStorage = (orders: Order[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
};

export const getOrders = async (): Promise<Order[]> => {
  await delay(300); 
  return getOrdersFromStorage();
};

export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<Order> => {
  await delay(300);
  const orders = getOrdersFromStorage();

  // kiểm tra mã đơn hàng có bị trùng ko 
  const isDup = orders.some((o) => o.orderCode === orderData.orderCode);
  if (isDup) {
    throw new Error('Mã đơn hàng đã tồn tại!');
  }

  const newOrder: Order = {
    ...orderData,
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
  };

  orders.push(newOrder);
  saveOrdersToStorage(orders);

  return newOrder;
};

export const updateOrder = async (id: string, updateData: Partial<Order>): Promise<Order> => {
  await delay(300);
  const orders = getOrdersFromStorage();

  // Kiểm tra mã đơn hàng có bị trùng không 
  if (updateData.orderCode) {
    const isDup = orders.some((o) => o.id !== id && o.orderCode === updateData.orderCode);
    if (isDup) {
      throw new Error('Mã đơn hàng đã tồn tại trên một đơn khác!');
    }
  }

  const orderIndex = orders.findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    throw new Error('Không tìm thấy đơn hàng!');
  }

  const updatedOrder = { ...orders[orderIndex], ...updateData };
  orders[orderIndex] = updatedOrder;

  saveOrdersToStorage(orders);

  return updatedOrder;
};

export const cancelOrder = async (id: string): Promise<Order> => {
  await delay(300);
  const orders = getOrdersFromStorage();

  const orderIndex = orders.findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    throw new Error('Không tìm thấy đơn hàng!');
  }

  if (orders[orderIndex].status !== OrderStatus.CHUA_XAC_NHAN) {
    throw new Error('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"!');
  }

  orders[orderIndex].status = OrderStatus.HUY;
  saveOrdersToStorage(orders);

  return orders[orderIndex];
};
