import React, { PureComponent, Fragment } from 'react';
import { Form, Modal, Input, Select, Switch } from 'antd';
const FormItem = Form.Item;

class CustomizedForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      allRoles: {},
      record: {},
    };
  }
  componentDidMount() {
    const { modalValue } = this.props;
    this.setState({
      allRoles: modalValue.allRoles || {},
      record: modalValue.record || {},
    });
  }
  onChange = (checkedList, item) => {
    const { allRules } = this.state;
    const backup = allRules;
    backup.roleRules[item].defaultValue = checkedList;
    this.setState({
      allRules: backup,
    });
  };
  render() {
    const { modalVisible, handleUpdateModalVisible, handleUpdate, form } = this.props;
    const { allRoles, record } = this.state;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        // form.resetFields()
        let data = {
          ...fieldsValue,
          inUse: fieldsValue.inUse ? 0 : 1,
        };
        if (record.hasOwnProperty('id')) {
          data.id = record.id;
          handleUpdate(data);
        } else {
          handleUpdate(data);
        }
      });
    };
    return (
      <Modal
        destroyOnClose //关闭时销毁 Modal 里的子元素
        title={record.userName || '新增帐号'}
        visible={modalVisible}
        width={570}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Fragment>
          <Form style={{ marginBottom: 15 }}>
            <FormItem label="用户名称" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('userName', {
                initialValue: record.userName || '',
                rules: [{ required: true, message: '请填写用户名称！' }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="用户昵称" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('nickName', {
                initialValue: record.nickName || '',
                rules: [{ required: true, message: '请填写用户昵称！' }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="用户密码" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('password', {
                initialValue: record.password || '',
                rules: [{ required: true, message: '请填写用户密码！' }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="用户厂商" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('producer', {
                initialValue: record.producer || '',
                rules: [{ required: true, message: '请填写用户所属厂商！' }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            {allRoles && Object.keys(allRoles).length ? (
              <FormItem label="选择角色" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                {form.getFieldDecorator('role', {
                  initialValue: record.role || '',
                  rules: [{ required: true, message: '请选择用户角色！' }],
                })(
                  <Select>
                    {allRoles.map(item => {
                      return (
                        <Select.Option value={item.id} key={item.id}>
                          {item.roleName}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            ) : null}
            <FormItem label="是否启用" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('inUse', {
                initialValue: record.inUse ? false : true,
                valuePropName: 'checked',
              })(<Switch checkedChildren="启" unCheckedChildren="禁" />)}
            </FormItem>
          </Form>
        </Fragment>
      </Modal>
    );
  }
}

const EditorForm = Form.create()(CustomizedForm);
export default EditorForm;
