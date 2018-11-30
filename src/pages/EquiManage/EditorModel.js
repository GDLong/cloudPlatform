import React, { PureComponent } from 'react';
import { Form, Input, Select, Modal, Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

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
        title="设备编辑"
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备名称">
          {form.getFieldDecorator('deviceName', {
            rules: [{ required: true, message: '请输入设备名称！' }],
            initialValue: values.deviceName,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备厂商">
          {form.getFieldDecorator('deviceProducer', {
            rules: [{ required: true, message: '请输入设备厂商!' }],
            initialValue: values.deviceProducer,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备编号">
          {form.getFieldDecorator('deviceId', {
            rules: [{ required: true, message: '请输入设备编号！' }],
            initialValue: values.deviceId,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="ICCID">
          {form.getFieldDecorator('iccid', {
            rules: [{ required: true, message: '请输入ICCID！' }],
            initialValue: values.iccid,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="IMEI">
          {form.getFieldDecorator('imei', {
            rules: [{ required: true, message: '请输入IMEI！' }],
            initialValue: values.imei,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="软件版本">
          {form.getFieldDecorator('softwareVersion', {
            rules: [{ required: true, message: '请输入软件版本！' }],
            initialValue: values.softwareVersion,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="硬件版本">
          {form.getFieldDecorator('hardwareVersion', {
            rules: [{ required: true, message: '请输入硬件版本！' }],
            initialValue: values.hardwareVersion,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否启用">
          {form.getFieldDecorator('inUse', { initialValue: values.inUse.toString() })(
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

const EditorForm = Form.create()(CustomizedForm);
export default EditorForm;
