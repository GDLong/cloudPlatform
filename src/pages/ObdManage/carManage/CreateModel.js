import React, { PureComponent } from 'react';
import { Form, Input, Select, Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class CustomizedForm extends PureComponent {
  constructor(props) {
    super(props);
  }
  okHandle = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  render() {
    const { modalVisible, form, handleModalVisible } = this.props;
    return (
      <Modal
        destroyOnClose //关闭时销毁 Modal 里的子元素
        title="添加车辆信息"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车辆vin码">
          {form.getFieldDecorator('vin', {
            rules: [{ required: true, message: '请输入车辆vin码' }],
            initialValue: '',
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车牌号">
          {form.getFieldDecorator('plateNo', {
            rules: [{ required: true, message: '请输入车牌号' }],
            initialValue: '',
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="imei">
          {form.getFieldDecorator('imei', {
            rules: [{ required: true, message: '请输入imei' }],
            initialValue: '',
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}
const CreateForm = Form.create()(CustomizedForm);

export default CreateForm;
