import React, { PureComponent } from 'react';
import { Form, Input, Modal } from 'antd';
const FormItem = Form.Item;

class CustomizedForm extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { updateModalVisible, handleUpdateModalVisible, handleUpdate, form, values } = this.props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        fieldsValue = {
          ...fieldsValue,
          id: values.id,
        };
        handleUpdate(fieldsValue);
      });
    };
    return (
      <Modal
        destroyOnClose //关闭时销毁 Modal 里的子元素
        title="编辑车辆信息"
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车辆vin码">
          {form.getFieldDecorator('vin', {
            rules: [{ required: true, message: '请输入车辆vin码' }],
            initialValue: values.vin || '',
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车牌号">
          {form.getFieldDecorator('plateNo', {
            rules: [{ required: true, message: '请输入车牌号' }],
            initialValue: values.plateNo || '',
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="imei">
          {form.getFieldDecorator('imei', {
            rules: [{ required: true, message: '请输入imei' }],
            initialValue: values.imei || '',
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

const EditorForm = Form.create()(CustomizedForm);
export default EditorForm;
