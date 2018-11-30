import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Popconfirm,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateForm from './CreateModel';
import EditorModel from './EditorModel';
import DetailModel from './DetailModel';

import styles from './EquiList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['error', 'success'];
const status = ['关闭', '运行中'];

/* eslint react/no-multi-comp:0 */
@connect(({ loading, bms }) => ({
  bms,
  loading: loading.models.bms,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    detailFormValues: {},
    formValues: {
      page: '1',
      pageSize: '10',
      startTime: '',
      endTime: '',
    },
  };

  columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '硬件ID',
      dataIndex: 'deviceId',
    },
    {
      title: '厂商',
      dataIndex: 'deviceProducer',
    },
    {
      title: 'iccid',
      dataIndex: 'iccid',
    },
    {
      title: '更新时间',
      dataIndex: 'gmt_modified',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDetailModalVisible(true, record)}>查看</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpgradeModalVisible(true, record)}>升级</a>
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

  componentDidMount() {
    this.commonPost();
  }
  commonPost = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bms/fetchBmsList',
      payload: {
        ...this.state.formValues,
      },
      callback: res => {
        if (res.code !== '000000') {
          if (res.code == '999999') {
            Modal.warning({
              title: res.msg,
              content: 'Please log back in when the session has timed out...',
              okText: '重新登录',
              onOk() {
                dispatch({
                  type: 'login/logout',
                });
              },
            });
            return;
          }
          message.warning(res.msg);
        }
      },
    });
  };
  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      ...formValues,
      page: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({
      formValues: {
        ...params,
      },
    });

    dispatch({
      type: 'bms/fetchBmsList',
      payload: params,
    });
  };
  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  // Popconfirm(确定删除)
  popConfirm = record => {
    const { dispatch } = this.props;
    var params = {
      allKeys: new Array(record.id),
    };
    dispatch({
      type: 'bms/fetchBmsDelete',
      payload: params,
      callback: res => {
        if (res.code == '000000') {
          message.success('删除成功');
          this.commonPost();
        } else {
          message.error('删除失败');
        }
      },
    });
  };
  // 批量删除
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    var _this = this;
    Modal.confirm({
      title: '确定要删除选中的数据么？',
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'bms/fetchBmsDelete',
            payload: {
              allKeys: selectedRows.map(row => row.id),
            },
            callback: res => {
              if (res.code == '000000') {
                resolve();
              } else {
                reject();
              }
            },
          });
        })
          .then(() => {
            _this.setState({
              selectedRows: [],
            });
            _this.commonPost();
            message.success('删除成功');
          })
          .catch(() => {
            message.error('删除失败');
          });
      },
      onCancel() {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  // 搜索
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    let values = null;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      var rangeValue = fieldsValue['chooseTime'];
      if (rangeValue !== undefined && rangeValue.length !== 0) {
        rangeValue = [
          rangeValue[0].format('YYYY-MM-DD HH:mm:ss'),
          rangeValue[1].format('YYYY-MM-DD HH:mm:ss'),
        ];
      } else {
        rangeValue = ['', ''];
      }
      values = {
        ...this.state.formValues,
        startTime: rangeValue[0],
        endTime: rangeValue[1],
        deviceId: fieldsValue.deviceId || '',
        iccid: fieldsValue.iccid || '',
        inUse: fieldsValue.inUse || '',
        page: 1,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'bms/fetchBmsList',
        payload: values,
      });
    });
  };
  // 添加设备
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  // 设备编辑
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  // 查看设备详情
  handleDetailModalVisible = (flag, record) => {
    this.setState({
      detailModalVisible: !!flag,
      detailFormValues: record || {},
    });
  };
  // 设备升级
  handleUpgradeModalVisible = (flag, record) => {
    message.info('占个位，占个位...');
  };
  // 添加设备确定按钮
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bms/fetchBmsCreate',
      payload: {
        ...fields,
      },
      callback: res => {
        if (res.code == '000000') {
          message.success('添加成功');
          this.handleModalVisible();
          this.commonPost();
        }
      },
    });
  };
  // 编辑设备确定按钮
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bms/fetchBmsUpdate',
      payload: {
        ...fields,
      },
      callback: res => {
        if (res.code == '000000') {
          message.success('编辑成功');
          this.handleUpdateModalVisible();
          this.commonPost();
        }
      },
    });
  };
  //
  handleDetail = fields => {
    message.success('配置成功');
    this.handleDetailModalVisible();
  };
  // 搜索条件
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="选择时间">
              {getFieldDecorator('chooseTime', {})(
                <RangePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  allowClear
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备编码">{getFieldDecorator('deviceId', {})(<Input />)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="ICCID">{getFieldDecorator('iccid', {})(<Input />)}</FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="是否启用">
              {getFieldDecorator('inUse', {})(
                <Select allowClear>
                  <Option value="0">是</Option>
                  <Option value="1">否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      bms: { bmsList },
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      detailModalVisible,
      stepFormValues,
      detailFormValues,
    } = this.state;
    // 新建
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    // 编辑
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    // 查看
    const detailMethods = {
      handleDetailModalVisible: this.handleDetailModalVisible,
      handleDetail: this.handleDetail,
    };

    return (
      <PageHeaderWrapper title="设备列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={() => this.handleMenuClick()}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={bmsList}
              rowKey={record => record.id}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <EditorModel
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
        {detailFormValues && Object.keys(detailFormValues).length ? (
          <DetailModel
            {...detailMethods}
            detailModalVisible={detailModalVisible}
            values={detailFormValues}
            dispatch={this.props.dispatch}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
