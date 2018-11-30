import React, { PureComponent, Fragment } from 'react';
import { Form, Checkbox, Modal, Collapse, Input } from 'antd';
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;

class CustomizedForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      allRules: {},
    };
  }
  componentDidMount() {
    const { modalValue } = this.props;
    this.setState({
      allRules: modalValue,
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
    const { allRules } = this.state;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        let arry = [];
        allRules.roleRules.forEach(item => {
          arry = arry.concat(item.defaultValue);
        });

        const data = {
          id: allRules.id,
          roleName: fieldsValue.roleName,
          resourceId: arry.join(';'),
        };
        handleUpdate(data);
      });
    };
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 15,
      border: 0,
      overflow: 'hidden',
    };
    const ForEachDom = () => {
      const items = allRules.roleRules.map((item, index) => {
        return (
          <Panel header={item.categoryName} key={item.key} style={customPanelStyle}>
            <div>
              <CheckboxGroup
                options={item.child}
                defaultValue={item.defaultValue}
                onChange={e => this.onChange(e, index)}
              />
            </div>
          </Panel>
        );
      });
      return (
        <Fragment>
          <Collapse bordered={false}>
            {/*defaultActiveKey={['1', '2']}*/}
            {items}
          </Collapse>
        </Fragment>
      );
    };
    return (
      <Modal
        destroyOnClose //关闭时销毁 Modal 里的子元素
        title={allRules.roleName || '新增角色'}
        visible={modalVisible}
        width={570}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Fragment>
          <Form layout="inline" style={{ marginBottom: 15 }}>
            <FormItem label="角色名称">
              {form.getFieldDecorator('roleName', {
                initialValue: allRules.roleName || '',
                rules: [{ required: true, message: '角色名称必填！' }],
              })(<Input autoComplete="off" />)}
            </FormItem>
          </Form>
          <ForEachDom />
        </Fragment>
      </Modal>
    );
  }
}

const EditorForm = Form.create()(CustomizedForm);
export default EditorForm;
