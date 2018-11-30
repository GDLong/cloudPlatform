import React, { PureComponent, Fragment } from 'react';
import { Form, Input, Modal, Tooltip, Icon } from 'antd';
import { formatId } from '@/utils/utils';
const FormItem = Form.Item;

class CustomizedForm extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { editorShow, editorValue, handleUpdate, handleUpdateModalVisible, form } = this.props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        if (editorValue.hasOwnProperty('diy')) {
          const data = {
            ...editorValue,
            ...fieldsValue,
          };
          handleUpdate(data);
        } else {
          const allKeys = formatterId();
          const data = {
            allKeys,
            ...fieldsValue,
          };
          handleUpdate(data);
        }
      });
    };
    const formatterId = () => {
      const keys = formatId(editorValue);
      return keys;
    };
    return (
      <Modal
        destroyOnClose //关闭时销毁 Modal 里的子元素
        title={editorValue.parentName || '新增分类'}
        visible={editorShow}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Fragment>
          <Form>
            <FormItem
              label={
                <span>
                  菜单图标&nbsp;
                  <Tooltip
                    title={
                      <a
                        href="https://ant.design/components/icon-cn/"
                        target="_blank"
                        style={{ color: '#ffffff' }}
                      >
                        图标请参考
                      </a>
                    }
                  >
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 13 }}
            >
              {form.getFieldDecorator('icon', {
                initialValue: editorValue.icon || '',
                rules: [{ required: true, message: '菜单图标不为空！！' }],
              })(<Input />)}
            </FormItem>
            <FormItem label="菜单名称" labelCol={{ span: 5 }} wrapperCol={{ span: 13 }}>
              {form.getFieldDecorator('parentName', {
                initialValue: editorValue.parentName || '',
                rules: [{ required: true, message: '菜单名称不为空！！' }],
              })(<Input />)}
            </FormItem>
            <FormItem label="菜单分类" labelCol={{ span: 5 }} wrapperCol={{ span: 13 }}>
              {form.getFieldDecorator('parentType', {
                initialValue: editorValue.parentType || '',
                rules: [{ required: true, message: '菜单分类不为空！！' }],
              })(<Input />)}
            </FormItem>
          </Form>
        </Fragment>
      </Modal>
    );
  }
}

const EditorForm = Form.create()(CustomizedForm);
export default EditorForm;
