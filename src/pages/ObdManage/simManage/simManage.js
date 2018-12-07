import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  DatePicker,
  message,
  Divider,
  Badge,
  Table,
  Input,
  Select,
  Popconfirm,
} from 'antd';
import { getAccess } from '@/utils/accessFunctions';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SimModel from './simModel';
import styles from './simManage.less';

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const statusMap = ['success', 'error'];
const status = ['启用', '关闭'];

/* eslint react/no-multi-comp:0 */
@connect(({ loading, obd, menuTree }) => ({
  obd,
  loading: loading.models.obd,
  menuTree: menuTree.menuData,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    access: {},
    formValues: {
      page: '1',
      pageSize: '10',
      startTime: '',
      endTime: '',
      simNo: '',
      inUse: '',
    },
    modalVisible: false,
    modalValues: {},
  };

  columns = [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      key: 'index',
    },
    {
      title: 'SIM卡号',
      dataIndex: 'simNo',
      key: 'simNo',
    },
    {
      title: '状态',
      dataIndex: 'inUse',
      key: 'inUse',
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '修改时间',
      dataIndex: 'gmt_modified',
      key: 'gmt_modified',
    },
    {
      title: '描述',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: '所属公司',
      dataIndex: 'producer',
      key: 'producer',
    },
    {
      title: '操作',
      render: record => (
        <Fragment>
          {this.state.access &&
          Object.keys(this.state.access).length &&
          this.state.access.hasOwnProperty('updateSimCard') ? (
            <Fragment>
              <a onClick={() => this.handleModalVisible(true, record)}>
                {this.state.access.updateSimCard.name}
              </a>
              <Divider type="vertical" />
            </Fragment>
          ) : null}
          {this.state.access &&
          Object.keys(this.state.access).length &&
          this.state.access.hasOwnProperty('deleteSimCard') ? (
            <Popconfirm
              title="确定删除该选项么?"
              onConfirm={() => this.popConfirm(record)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <a>{this.state.access.deleteSimCard.name}</a>
            </Popconfirm>
          ) : null}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      location: { pathname },
      menuTree,
    } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'obd/fetchQuerySimCard',
      payload: formValues,
    });

    const access = getAccess(pathname, menuTree);
    this.setState({
      access: access.childMap || {},
    });
  }
  // 分页change
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      ...formValues,
      page: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({
      formValues: params,
    });

    dispatch({
      type: 'obd/fetchQuerySimCard',
      payload: params,
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };
  // 查询
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { formValues } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = null;

      var rangeValue = fieldsValue['chooseTime'];
      if (rangeValue !== undefined && rangeValue.length !== 0) {
        rangeValue = [
          rangeValue[0].format('YYYY-MM-DD HH:mm'),
          rangeValue[1].format('YYYY-MM-DD HH:mm'),
        ];
      } else {
        rangeValue = ['', ''];
      }
      values = {
        ...formValues,
        startTime: rangeValue[0],
        endTime: rangeValue[1],
        page: 1,
        simNo: fieldsValue.simNo,
        inUse: fieldsValue.inUse,
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'obd/fetchQuerySimCard',
        payload: values,
      });
    });
  };
  // 新增和编辑
  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      modalValues: record || {},
    });
  };
  // 新增和编辑---submit
  handleSubmit = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    if (fields.hasOwnProperty('id')) {
      dispatch({
        type: 'obd/fetchUpdateSimCard',
        payload: fields,
        callback: res => {
          if (res.code !== '000000') message.warning(res.msg);
          if (res.code === '000000') message.success('修改成功！！');
          this.handleModalVisible();
          dispatch({
            type: 'obd/fetchQuerySimCard',
            payload: formValues,
          });
        },
      });
    } else {
      dispatch({
        type: 'obd/fetchAddSimCard',
        payload: fields,
        callback: res => {
          if (res.code !== '000000') message.warning(res.msg);
          if (res.code === '000000') message.success('添加成功！！');
          this.handleModalVisible();
          dispatch({
            type: 'obd/fetchQuerySimCard',
            payload: formValues,
          });
        },
      });
    }
  };
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="选择时间">
              {getFieldDecorator('chooseTime', {})(
                <RangePicker
                  allowClear
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="激活状态">
              {getFieldDecorator('inUse', {
                initialValue: '',
              })(
                <Select>
                  <Option value={''}>全部</Option>
                  <Option value={0}>启用</Option>
                  <Option value={1}>关闭</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="SIM卡号">
              {getFieldDecorator('simNo', { initialValue: '' })(<Input autoComplete="off" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              {this.state.access &&
              Object.keys(this.state.access).length &&
              this.state.access.hasOwnProperty('querySimCard') ? (
                <Button type="primary" htmlType="submit">
                  {this.state.access.querySimCard.name}
                </Button>
              ) : null}
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  popConfirm(record) {
    const { dispatch } = this.props;
    let keys = new Array();
    keys.push(record.id);
    dispatch({
      type: 'obd/fetchDeleteSimCard',
      payload: { allKeys: keys },
      callback: res => {
        const { formValues } = this.state;
        dispatch({
          type: 'obd/fetchQuerySimCard',
          payload: formValues,
        });
      },
    });
  }
  render() {
    const {
      obd: { simCardList },
      loading,
    } = this.props;
    const { modalVisible, modalValues, access } = this.state;
    // 新建
    const handleMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };
    console.log(access);
    return (
      <PageHeaderWrapper title="SIM卡管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {access && Object.keys(access).length && access.hasOwnProperty('addSimCard') ? (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  {access.addSimCard.name}
                </Button>
              ) : null}
            </div>
            <div className={styles.tableList}>
              <Table
                loading={loading}
                dataSource={simCardList.list}
                columns={this.columns}
                pagination={simCardList.pagination}
                onChange={this.handleStandardTableChange}
                rowKey={record => record.id}
              />
            </div>
          </div>
        </Card>
        <SimModel {...handleMethods} modalVisible={modalVisible} modalValues={modalValues} />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
