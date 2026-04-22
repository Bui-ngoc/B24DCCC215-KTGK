import { Order, OrderStatus } from '@/services/QuanLyDonHang/order/typing.d';

export interface OrderTableProps {
  dataSource: Order[];
  loading: boolean;
  onEdit: (record: Order) => void;
  onCancelClick: (record: Order) => void;
}

export interface OrderFormModalProps {
  visible: boolean;
  initialValues?: Partial<Order>;
  onCancel: () => void;
  onSubmit: (values: Omit<Order, 'id'>) => Promise<void>;
  loading: boolean;
}
