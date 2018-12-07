import React, { PureComponent } from 'react';
import { Form, Input, Select, Modal, Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
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
        title="添加设备"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备名称">
          {form.getFieldDecorator('deviceName', {
            rules: [{ required: true, message: '请输入设备名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备厂商">
          {form.getFieldDecorator('deviceProducer', {
            rules: [{ required: true, message: '请输入设备厂商!' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备编号">
          {form.getFieldDecorator('deviceId', {
            rules: [{ required: true, message: '请输入设备编号！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="ICCID">
          {form.getFieldDecorator('iccid', {
            rules: [{ required: true, message: '请输入ICCID！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="IMEI">
          {form.getFieldDecorator('imei', {
            rules: [{ required: true, message: '请输入IMEI！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="软件版本">
          {form.getFieldDecorator('softwareVersion', {
            rules: [{ required: true, message: '请输入软件版本！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="硬件版本">
          {form.getFieldDecorator('hardwareVersion', {
            rules: [{ required: true, message: '请输入硬件版本！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否启用">
          {form.getFieldDecorator('inUse', { initialValue: '0' })(
            <RadioGroup>
              <Radio value="0">已经启用</Radio>
              <Radio value="1">没有启用</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Modal>
    );
  }
}
const CreateForm = Form.create()(CustomizedForm);

export default CreateForm;
