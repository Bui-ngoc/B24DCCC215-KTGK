import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Space, InputNumber, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { OrderFormModalProps } from '../typing';
import { CUSTOMERS_MOCK, PRODUCTS_MOCK, ORDER_STATUS_OPTIONS } from '../constansts';

const { Option } = Select;
const { Text } = Typography;

const OrderFormModal: React.FC<OrderFormModalProps> = ({
  visible,
  initialValues,
  onCancel,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();
  const isEditing = !!initialValues?.orderCode;

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          products: initialValues.products || [],
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          products: [{}], 
          status: ORDER_STATUS_OPTIONS[0].value,
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleFinish = async (values: any) => {
    const { products } = values;
    let totalAmount = 0;

    // Tính tổng tiền dựa trên giá của sản phẩm và số lượng
    if (products && products.length > 0) {
      products.forEach((p: any) => {
        if (!p) return;
        const prodDef = PRODUCTS_MOCK.find((item) => item.id === p.productId);
        if (prodDef && p.quantity) {
          totalAmount += prodDef.price * p.quantity;
        }
      });
    }

    const submitData = {
      ...values,
      totalAmount,
      orderDate: initialValues?.orderDate || new Date().toISOString(),
    };

    await onSubmit(submitData);
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa đơn hàng' : 'Thêm mới đơn hàng'}
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ status: ORDER_STATUS_OPTIONS[0].value }}
      >
        <Form.Item
          label="Mã đơn hàng"
          name="orderCode"
          rules={[
            { required: true, message: 'Vui lòng nhập mã đơn hàng' },
            { whitespace: true, message: 'Không được để khoảng trắng' },
          ]}
        >
          <Input placeholder="Nhập mã đơn hàng..." disabled={isEditing} />
        </Form.Item>

        <Form.Item
          label="Khách hàng"
          name="customerName"
          rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
        >
          <Select placeholder="Chọn khách hàng">
            {CUSTOMERS_MOCK.map((c) => (
              <Option key={c.value} value={c.value}>
                {c.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái">
            {ORDER_STATUS_OPTIONS.map((c) => (
              <Option key={c.value} value={c.value}>
                {c.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Danh sách sản phẩm:</Text>
        </div>
        <Form.List
          name="products"
          rules={[
            {
              validator: async (_, products) => {
                if (!products || products.length < 1) {
                  return Promise.reject(new Error('Phải chọn ít nhất 1 sản phẩm'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'productId']}
                    rules={[{ required: true, message: 'Chọn sản phẩm' }]}
                  >
                    <Select placeholder="Sản phẩm" style={{ width: 300 }}>
                      {PRODUCTS_MOCK.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name} -{' '}
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(item.price)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'quantity']}
                    rules={[{ required: true, message: 'Nhập SL' }]}
                  >
                    <InputNumber placeholder="Số lượng" min={1} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add({})} block icon={<PlusOutlined />}>
                  Thêm sản phẩm
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item shouldUpdate>
          {() => {
            const products = form.getFieldValue('products') || [];
            let totalAmount = 0;
            products.forEach((p: any) => {
              if (!p) return;
              const prodDef = PRODUCTS_MOCK.find((item) => item.id === p.productId);
              if (prodDef && p.quantity) {
                totalAmount += prodDef.price * p.quantity;
              }
            });
            return (
              <Typography.Title level={5}>
                Tổng tiền tự tính:{' '}
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  totalAmount,
                )}
              </Typography.Title>
            );
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderFormModal;
