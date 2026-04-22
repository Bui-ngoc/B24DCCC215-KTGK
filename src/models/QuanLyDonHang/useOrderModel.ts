import { useState, useCallback } from 'react';
import { message } from 'antd';
import { Order } from '@/services/QuanLyDonHang/order/typing.d';
import {
  getOrders,
  createOrder,
  updateOrder,
  cancelOrder,
} from '@/services/QuanLyDonHang/order';

export default () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error: any) {
      message.error(error.message || 'Lỗi khi lấy danh sách đơn hàng!');
    } finally {
      setLoading(false);
    }
  }, []);

  const addOrder = async (orderData: Omit<Order, 'id'>) => {
    setLoading(true);
    try {
      const newOrder = await createOrder(orderData);
      setOrders((prev) => [...prev, newOrder]);
      message.success('Thêm đơn hàng thành công!');
      return true;
    } catch (error: any) {
      message.error(error.message || 'Lỗi khi thêm đơn hàng!');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editOrder = async (id: string, updateData: Partial<Order>) => {
    setLoading(true);
    try {
      const updatedOrder = await updateOrder(id, updateData);
      setOrders((prev) => prev.map((o) => (o.id === id ? updatedOrder : o)));
      message.success('Cập nhật đơn hàng thành công!');
      return true;
    } catch (error: any) {
      message.error(error.message || 'Lỗi khi cập nhật đơn hàng!');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id: string) => {
    setLoading(true);
    try {
      const canceledOrder = await cancelOrder(id);
      setOrders((prev) => prev.map((o) => (o.id === id ? canceledOrder : o)));
      message.success('Hủy đơn hàng thành công!');
      return true;
    } catch (error: any) {
      message.error(error.message || 'Lỗi khi hủy đơn hàng!');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    fetchOrders,
    addOrder,
    editOrder,
    handleCancelOrder,
  };
};
