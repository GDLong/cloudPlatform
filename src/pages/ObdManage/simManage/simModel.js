import React, { PureComponent } from 'react';
import { Form, Input, Select, Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class CustomizedForm extends PureComponent {
  constructor(props) {
    super(props);
  }
  okHandle = () => {
    const { form, handleSubmit, modalValues } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (Object.keys(modalValues).length) {
        // 修改
        fieldsValue.id = modalValues.id;
      }
      form.resetFields();
      handleSubmit(fieldsValue);
    });
  };
  render() {
    const { modalVisible, modalValues, handleModalVisible, form } = this.props;
    return (
      <Modal
        destroyOnClose //关闭时销毁 Modal 里的子元素
        title={Object.keys(modalValues).length ? '修改sim卡' : '添加sim卡'}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="sim卡号">
          {form.getFieldDecorator('simNo', {
            rules: [{ required: true, message: '请输入sim卡号' }],
            initialValue: modalValues.simNo || '',
          })(<Input placeholder="请输入" autoComplete="off" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="运营商">
          {form.getFieldDecorator('producer', {
            rules: [{ required: true, message: '请输入运营商' }],
            initialValue: modalValues.producer || '',
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否启用">
          {form.getFieldDecorator('inUse', {
            rules: [{ required: true }],
            initialValue: Object.keys(modalValues).length ? modalValues.inUse : 0,
          })(
            <Select style={{ width: '100%' }}>
              <Option value={0}>启用</Option>
              <Option value={1}>关闭</Option>
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注信息">
          {form.getFieldDecorator('remarks', {
            rules: [{ required: true, message: '请输入备注信息' }],
            initialValue: modalValues.remarks || '',
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}
const CreateForm = Form.create()(CustomizedForm);

export default CreateForm;
