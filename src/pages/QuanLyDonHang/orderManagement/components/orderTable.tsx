import React from 'react';
import { Table, Tag, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, StopOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import { Order, OrderStatus } from '@/services/QuanLyDonHang/order/typing.d';
import { ORDER_STATUS_TAGS } from '../constansts';
import { OrderTableProps } from '../typing';
import moment from 'moment';

const OrderTable: React.FC<OrderTableProps> = ({ dataSource, loading, onEdit, onCancelClick }) => {
  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
      sorter: (a, b) => a.orderCode.localeCompare(b.orderCode),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (val) => moment(val).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => {
        const color = ORDER_STATUS_TAGS[status];
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          {record.status === OrderStatus.CHUA_XAC_NHAN && (
            <Popconfirm
              title="Bạn có chắc chắn muốn hủy đơn hàng này không?"
              onConfirm={() => onCancelClick(record)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button type="default" danger icon={<StopOutlined />} size="small">
                Hủy đơn
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
};

export default OrderTable;
