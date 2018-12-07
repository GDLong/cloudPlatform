import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, Table, Form, Modal, message, Input, Divider, Popconfirm } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RoleModel from './roleModel';
import { getAccess } from '@/utils/accessFunctions';

@Form.create()
@connect(({ system, loading, menuTree }) => ({
  system,
  loading: loading.models.system,
  menuTree: menuTree.menuData,
}))

// @Form.create()
class CardList extends PureComponent {
  state = {
    access: {},
    modalVisible: false,
    modalValue: {},
  };
  componentDidMount() {
    const {
      dispatch,
      location: { pathname },
      menuTree,
    } = this.props;
    dispatch({
      type: 'system/fetchQueryAllRoles',
    });

    const access = getAccess(pathname, menuTree);
    this.setState({
      access: access.childRoutes || {},
    });
  }
  // 编辑分类--start
  handleUpdateModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    if (!record) {
      // cancel
      this.setState({
        modalVisible: !!flag,
        modalValue: record || {},
      });
      return;
    }
    if (record.hasOwnProperty('id')) {
      // 编辑
      const data = {
        id: record.id,
        roleName: record.roleName,
      };
      dispatch({
        type: 'system/fetchQueryResourceByRole',
        payload: { roleId: record.id },
        callback: res => {
          if (res.code !== '000000') {
            message.warning(res.msg);
            return;
          }
          data.roleRules = res.resourceList;
          this.setState({
            modalVisible: !!flag,
            modalValue: data || {},
          });
        },
      });
    } else {
      // 新增
      const data = {};
      dispatch({
        type: 'system/fetchQueryResourceByRole',
        payload: {},
        callback: res => {
          if (res.code !== '000000') {
            message.warning(res.msg);
            return;
          }
          data.roleRules = res.resourceList;
          this.setState({
            modalVisible: !!flag,
            modalValue: data || {},
          });
        },
      });
    }
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    if (fields.id) {
      dispatch({
        type: 'system/fetchUpdateRoles',
        payload: fields,
        callback: res => {
          if (res.code !== '000000') {
            message.warning(res.msg);
            return;
          }
          message.success('修改成功！！');
          this.handleUpdateModalVisible();
          dispatch({
            type: 'system/fetchQueryAllRoles',
          });
        },
      });
    } else {
      dispatch({
        type: 'system/fetchAddRole',
        payload: fields,
        callback: res => {
          if (res.code !== '000000') {
            message.warning(res.msg);
            return;
          }
          message.success('添加成功！！');
          this.handleUpdateModalVisible();
          dispatch({
            type: 'system/fetchQueryAllRoles',
          });
        },
      });
    }
  };
  // 编辑分类--end
  handleButton() {}
  popConfirm(record) {
    const { dispatch } = this.props;
    const arry = new Array();
    arry.push(record.id);
    console.log(arry);
    dispatch({
      type: 'system/fetchDeleteRole',
      payload: { allKeys: arry },
      callback: res => {
        if (res.code !== '000000') {
          message.warning(res.msg);
          return;
        }
        dispatch({
          type: 'system/fetchQueryAllRoles',
        });
      },
    });
  }
  render() {
    const {
      system: {
        queryAllRoles: { role },
      },
      loading,
    } = this.props;
    const { modalVisible, modalValue } = this.state;
    const columns = [
      {
        title: '序号',
        width: '10%',
        render: (text, record, index) => `${index + 1}`,
        key: 'index',
      },
      {
        title: '角色',
        dataIndex: 'roleName',
      },
      {
        title: '修改时间',
        dataIndex: 'gmt_modified',
      },
      {
        title: '操作',
        width: 170,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleButton(true, record)}>查看</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除该选项么?"
              onConfirm={() => this.popConfirm(record)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    // 编辑--分类
    const updateMethods = {
      handleUpdate: this.handleUpdate,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };
    return (
      <PageHeaderWrapper title="角色管理">
        <Card bordered={false}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => this.handleUpdateModalVisible(true, { diy: '123' })}
            style={{ marginBottom: 15 }}
          >
            新增
          </Button>
          <Table
            dataSource={role}
            columns={columns}
            rowKey={record => record.id}
            loading={loading}
          />
        </Card>
        {modalValue && Object.keys(modalValue).length ? (
          <RoleModel modalVisible={modalVisible} modalValue={modalValue} {...updateMethods} />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
