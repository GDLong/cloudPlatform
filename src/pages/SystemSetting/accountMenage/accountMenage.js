import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Badge,
  Table,
  Form,
  Modal,
  message,
  Switch,
  Divider,
  Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AccountModel from './accountModel';
const statusMap = ['success', 'error'];
const status = ['启用', '关闭'];

@Form.create()
@connect(({ system, loading }) => ({
  system,
  loading: loading.models.system,
}))
class CardList extends PureComponent {
  state = {
    modalVisible: false,
    modalValue: {},
    queryCondition: {
      page: 1,
      pageSize: 10,
      startTime: '',
      endTime: '',
    },
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { queryCondition } = this.state;
    dispatch({
      type: 'system/fetchQueryUser',
      payload: queryCondition,
    });
  }
  handlePageChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { queryCondition } = this.state;
    const page = {
      ...queryCondition,
      page: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({
      queryCondition: page,
    });
    dispatch({
      type: 'system/fetchQueryUser',
      payload: page,
    });
  };
  handleSwitchChange = (e, record) => {
    const { dispatch } = this.props;
    const { queryCondition } = this.state;
    const data = {
      ...record,
      inUse: e ? 0 : 1,
    };
    dispatch({
      type: 'system/fetchUpdateUser',
      payload: data,
      callback: res => {
        if (res.code !== '000000') {
          message.warning(res.msg);
          return;
        }
        message.success('设置成功！！');
        dispatch({
          type: 'system/fetchQueryUser',
          payload: queryCondition,
        });
      },
    });
  };
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
        record,
      };
      dispatch({
        type: 'system/fetchQueryAllRoles',
        callback: res => {
          if (res.code !== '000000') {
            message.warning(res.msg);
            return;
          }
          data.allRoles = res.role;
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
        type: 'system/fetchQueryAllRoles',
        callback: res => {
          if (res.code !== '000000') {
            message.warning(res.msg);
            return;
          }
          data.allRoles = res.role;
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
    const { queryCondition } = this.state;
    if (fields.hasOwnProperty('id')) {
      dispatch({
        type: 'system/fetchUpdateUser',
        payload: fields,
        callback: res => {
          if (res.code !== '000000') {
            message.warning(res.msg);
            return;
          }
          message.success('修改成功！！');
          this.handleUpdateModalVisible();
          dispatch({
            type: 'system/fetchQueryUser',
            payload: queryCondition,
          });
        },
      });
    } else {
      dispatch({
        type: 'system/fetchAddUser',
        payload: fields,
        callback: res => {
          if (res.code !== '000000') {
            message.warning(res.msg);
            return;
          }
          message.success('添加成功！！');
          this.handleUpdateModalVisible();
          dispatch({
            type: 'system/fetchQueryUser',
            payload: queryCondition,
          });
        },
      });
    }
  };
  // 编辑分类--end
  handleButton() {}
  popConfirm(record) {
    const { dispatch } = this.props;
    const { queryCondition } = this.state;
    const arry = new Array();
    arry.push(record.id);
    dispatch({
      type: 'system/fetchDeleteUser',
      payload: { allKeys: arry },
      callback: res => {
        if (res.code !== '000000') {
          message.warning(res.msg);
          return;
        }
        dispatch({
          type: 'system/fetchQueryUser',
          payload: queryCondition,
        });
      },
    });
  }

  render() {
    const {
      system: { AllUser },
      loading,
    } = this.props;
    const { modalVisible, modalValue } = this.state;

    // if (AllUser.code !== "000000") {message.warning(AllUser.msg);return;}
    const columns = [
      {
        title: '序号',
        width: '10%',
        render: (text, record, index) => `${index + 1}`,
        key: 'index',
      },
      {
        title: '账号名',
        dataIndex: 'userName',
      },
      {
        title: '状态',
        dataIndex: 'inUse',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '修改时间',
        dataIndex: 'gmt_modified',
      },
      {
        title: '操作',
        width: 200,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            <Switch
              checkedChildren="启"
              unCheckedChildren="禁"
              defaultChecked={record.inUse ? false : true}
              loading={loading}
              style={{ position: 'relative', top: '-2px' }}
              onChange={e => this.handleSwitchChange(e, record)}
            />
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
      <PageHeaderWrapper title="账号管理">
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
            loading={loading}
            dataSource={AllUser.list}
            columns={columns}
            pagination={AllUser.pagination}
            onChange={this.handlePageChange}
            rowKey={record => record.id}
          />
        </Card>
        {modalValue && Object.keys(modalValue).length ? (
          <AccountModel modalVisible={modalVisible} modalValue={modalValue} {...updateMethods} />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
