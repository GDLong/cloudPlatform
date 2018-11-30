import React, { PureComponent, Fragment } from 'react';
import { Form, Input, Modal, Button, Divider, Row, Col, Icon, Popconfirm, message } from 'antd';
const FormItem = Form.Item;
class CustomizedForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      functAuthority: {},
      modelVisible: false,
      modelValue: {},
      index: '',
    };
  }
  componentDidMount() {
    const { editorValue } = this.props;
    if (editorValue.diy !== '123') {
      this.setState({
        functAuthority: {
          ...editorValue,
          deleteId: [],
        },
      });
    } else {
      this.setState({
        functAuthority: {
          icon: editorValue.icon,
          parentName: editorValue.parentName,
          parentType: editorValue.parentType,
          category: '',
          categoryName: '',
          categoryUrl: '',
          child: [],
          deleteId: [],
        },
      });
    }
  }
  // 新增功能窗口显示或隐藏
  handleModelVisible = (flag, record, index) => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        functAuthority: { child },
      } = this.state;
      let num = 0;
      if (index === undefined) {
        num = 0;
        if (child.length) {
          num = child.length + 1;
        }
        this.setState({
          modelVisible: !!flag,
          modelValue: record || {},
          index: num,
        });
      } else {
        this.setState({
          modelVisible: !!flag,
          modelValue: record || {},
          index: index,
        });
      }
    });
  };
  // 新增功能
  handleModelSubmit = () => {
    const { handleUpdateMenu, form } = this.props;
    const {
      functAuthority,
      functAuthority: { child },
      modelValue,
      index,
    } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const data = {
        ...modelValue,
        title: fieldsValue.title,
        url: fieldsValue.url,
      };
      const temp = child;
      temp.splice(index, 1, data);
      this.setState({
        functAuthority: {
          ...functAuthority,
          child: temp,
        },
      });
      this.handleModelVisible();
    });
  };
  // 删除功能
  popConfirm = (index, id) => {
    const {
      functAuthority,
      functAuthority: { child, deleteId },
    } = this.state;
    const data = child;
    data.splice(index, 1);
    const deleteAll = deleteId;
    deleteAll.push(id);
    this.setState({
      functAuthority: {
        ...functAuthority,
        child: data,
        deleteId: deleteAll,
      },
    });
  };
  render() {
    const { editorShow, handleUpdateMenu, handleUpdateModalVisibleMenu, form } = this.props;
    const { functAuthority, modelValue, modelVisible } = this.state;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const data = {
          ...functAuthority,
          category: fieldsValue.category,
          categoryName: fieldsValue.categoryName,
          categoryUrl: fieldsValue.categoryUrl,
        };
        this.setState({
          functAuthority: data,
        });
        form.resetFields();
        handleUpdateMenu(data);
      });
    };
    const cancelHandle = () => {
      handleUpdateModalVisibleMenu();
    };
    const ForEachFunc = () => {
      const {
        functAuthority: { child },
      } = this.state;
      //判断是否-新增或者没有菜单
      if (!child || !Object.keys(child).length) return null;

      const items = child.map((item, index) => {
        return (
          <div className="ant-row ant-form-item" style={{ marginBottom: 10 }} key={index}>
            <div className="ant-col-4 ant-form-item-label">
              <label>{item.title}</label>
            </div>
            <div className="ant-col-20 ant-form-item-control-wrapper">
              <div className="ant-form-item-control has-success">
                <span className="ant-form-item-children">
                  <div className="ant-row" style={{ marginLeft: -4, marginRight: -4 }}>
                    <div className="ant-col-14" style={{ paddingLeft: 4, paddingRight: 4 }}>
                      <Input disabled defaultValue={item.url} />
                    </div>
                    <div className="ant-col-10" style={{ paddingLeft: 4, paddingRight: 4 }}>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => this.handleModelVisible(true, item, index)}
                      >
                        编辑
                      </Button>
                      &nbsp;&nbsp;
                      <Popconfirm
                        title="确定删除该选项么?"
                        onConfirm={() => this.popConfirm(index, item.id)}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button size="small" type="danger">
                          删除
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </span>
              </div>
            </div>
          </div>
        );
      });
      return <Fragment>{items}</Fragment>;
    };
    return (
      <Fragment>
        <Modal
          destroyOnClose //关闭时销毁 Modal 里的子元素
          title={functAuthority.categoryName ? '编辑菜单' : '新增菜单'}
          visible={editorShow}
          width={570}
          onOk={okHandle}
          onCancel={cancelHandle}
        >
          <Fragment>
            <Form>
              <FormItem label="菜单名称" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                {form.getFieldDecorator('categoryName', {
                  initialValue: functAuthority.categoryName || '',
                  rules: [{ required: true, message: '菜单名称必填！！' }],
                })(<Input />)}
              </FormItem>
              <FormItem label="菜单标识" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                {form.getFieldDecorator('category', {
                  initialValue: functAuthority.category || '',
                  rules: [{ required: true, message: '菜单标识必填！！' }],
                })(<Input />)}
              </FormItem>
              <FormItem label="菜单路由" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                {form.getFieldDecorator('categoryUrl', {
                  initialValue: functAuthority.categoryUrl || '',
                  rules: [{ required: true, message: '菜单路由必填！！' }],
                })(<Input />)}
              </FormItem>
            </Form>
            <Divider orientation="left" style={{ fontSize: 12 }}>
              菜单功能
            </Divider>
            <ForEachFunc desc="功能列表" />
            <div style={{ textAlign: 'center', marginTop: 15 }}>
              <Button
                type="dashed"
                onClick={() => this.handleModelVisible(true, { diy: '123' })}
                style={{ width: '40%' }}
              >
                <Icon type="plus" /> Add child
              </Button>
            </div>
          </Fragment>
          {modelValue && Object.keys(modelValue).length ? (
            <Modal
              destroyOnClose //关闭时销毁 Modal 里的子元素
              title={modelValue.title ? '编辑功能' : '新增功能'}
              visible={modelVisible}
              onOk={() => this.handleModelSubmit()}
              onCancel={() => this.handleModelVisible()}
            >
              <Form>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="功能名称">
                  {form.getFieldDecorator('title', {
                    initialValue: modelValue.title || '',
                    rules: [{ required: true, message: '功能名称必填！' }],
                  })(<Input />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="功能接口">
                  {form.getFieldDecorator('url', {
                    initialValue: modelValue.url || '',
                    rules: [{ required: true, message: '功能接口必填！' }],
                  })(<Input />)}
                </FormItem>
              </Form>
            </Modal>
          ) : null}
        </Modal>
      </Fragment>
    );
  }
}

const EditorForm = Form.create()(CustomizedForm);
export default EditorForm;
