import React, { useEffect, useState, useMemo } from 'react';
import { useModel } from 'umi';
import { Card, Button, Input, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import OrderTable from './components/orderTable';
import OrderFormModal from './components/orderFormModal';
import { Order, OrderStatus } from '@/services/QuanLyDonHang/order/typing.d';
import { ORDER_STATUS_OPTIONS } from './constansts';
import './index.less';

const { Option } = Select;

const OrderManagement: React.FC = () => {
  const { orders, loading, fetchOrders, addOrder, editOrder, handleCancelOrder } =
    useModel('QuanLyDonHang.useOrderModel');

  const [filterText, setFilterText] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | undefined>(undefined);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<Partial<Order> | undefined>(undefined);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Xử lý tìm kiếm và lọc 
  const filteredOrders = useMemo(() => {
    let result = orders;
    if (filterText) {
      const lowerText = filterText.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderCode.toLowerCase().includes(lowerText) ||
          o.customerName.toLowerCase().includes(lowerText),
      );
    }
    if (filterStatus) {
      result = result.filter((o) => o.status === filterStatus);
    }
    return result;
  }, [orders, filterText, filterStatus]);

  const handleOpenAdd = () => {
    setEditingOrder(undefined);
    setModalVisible(true);
  };

  const handleOpenEdit = (record: Order) => {
    setEditingOrder(record);
    setModalVisible(true);
  };

  const handleSubmit = async (values: Omit<Order, 'id'>) => {
    if (editingOrder?.id) {
      const success = await editOrder(editingOrder.id, values);
      if (success) setModalVisible(false);
    } else {
      const success = await addOrder(values);
      if (success) setModalVisible(false);
    }
  };

  return (
    <div className="orderManagementContainer">
      <div className="headerArea">
        <h1 className="title">Quản Lý Đơn Hàng</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
          Thêm đơn hàng
        </Button>
      </div>

      <div className="filtersArea">
        <Input.Search
          className="filterInput"
          placeholder="Tìm theo Mã đơn / Khách hàng"
          allowClear
          onSearch={(val) => setFilterText(val)}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <Select
          className="filterSelect"
          placeholder="Lọc theo trạng thái"
          allowClear
          onChange={(val) => setFilterStatus(val)}
        >
          {ORDER_STATUS_OPTIONS.map((s) => (
            <Option key={s.value} value={s.value}>
              {s.label}
            </Option>
          ))}
        </Select>
      </div>

      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <OrderTable
          dataSource={filteredOrders}
          loading={loading}
          onEdit={handleOpenEdit}
          onCancelClick={(record) => handleCancelOrder(record.id)}
        />
      </Card>

      <OrderFormModal
        visible={modalVisible}
        initialValues={editingOrder}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default OrderManagement;
