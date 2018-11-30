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
import LocalModel from './LocalModel';

import styles from './ObdList.less';

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
@connect(({ loading, obd }) => ({
  obd,
  loading: loading.models.obd,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    localModalVisible: false,
    selectedRows: [],
    formValues: {
      page: '1',
      pageSize: '10',
      startTime: '',
      endTime: '',
    }, //obd列表查询条件
    stepFormValues: {},
    detailFormValues: {},
    localFormValues: {},
  };

  columns = [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      key: 'index',
    },
    {
      title: '车架号',
      dataIndex: 'vin',
    },
    {
      title: '车牌号',
      dataIndex: 'plateNo',
    },
    {
      title: 'sim卡号',
      dataIndex: 'imei',
    },
    {
      title: '创建时间',
      dataIndex: 'gmt_create',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDetailModalVisible(true, record)}>查看</a>
          {/* <Divider type="vertical" />
                    <a onClick={() => this.handleLocalModalVisible(true, record)}>位置轨迹</a> */}
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除该选项么?"
            onConfirm={() => this.popConfirm(record)}
            onCancel={() => this.popConcel(record)}
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
    const { dispatch } = this.props;
    dispatch({
      type: 'obd/fetchObdList',
      payload: { ...this.state.formValues },
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
      formValues: {
        ...params,
      },
    });

    dispatch({
      type: 'obd/fetchObdList',
      payload: params,
    });
  };
  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    var FormReset = {
      startTime: '',
      endTime: '',
      imei: '',
      plateNo: '',
      vin: '',
      page: '1',
      pageSize: '10',
    };
    this.setState({
      formValues: FormReset,
    });
    // dispatch({
    //     type: 'rule/fetch',
    //     payload: {},
    // });
  };
  // 批量删除
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    var _this = this;
    if (!selectedRows) return;
    Modal.confirm({
      title: '确定要删除选中的数据么？',
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'obd/fetchObdRemove',
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
            dispatch({
              type: 'obd/fetchObdList',
              payload: { ..._this.state.formValues },
            });
            message.success('删除成功');
          })
          .catch(() => {
            message.error('删除失败');
          });
      },
      onCancel() {},
    });
  };
  // Popconfirm(确定删除)
  popConfirm = record => {
    const { dispatch } = this.props;
    var allKeys = [];
    allKeys.push(record.id);
    var params = {
      allKeys: allKeys,
    };
    dispatch({
      type: 'obd/fetchObdRemove',
      payload: params,
      callback: res => {
        if (res.code == '000000') {
          message.success('删除成功');
          dispatch({
            type: 'obd/fetchObdList',
            payload: { ...this.state.formValues },
          });
        } else {
          message.error('删除失败');
        }
      },
    });
  };
  // Popconfirm(取消删除)
  popConcel = record => {
    // console.log("recordno", record)
  };
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  // 查询
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

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
        ...this.state.formValues,
        startTime: rangeValue[0],
        endTime: rangeValue[1],
        imei: fieldsValue.imei || '',
        plateNo: fieldsValue.plateNo || '',
        vin: fieldsValue.vin || '',
        page: 1,
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'obd/fetchObdList',
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
  // 编辑设备
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
  // 查看轨迹地图
  handleLocalModalVisible = (flag, record) => {
    this.setState({
      localModalVisible: !!flag,
      localFormValues: record || {},
    });
  };
  // 添加车辆信息确定按钮
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'obd/fetchObdAdd',
      payload: {
        ...fields,
      },
      callback: res => {
        if (res.code == '000000') {
          message.success('添加成功');
          dispatch({
            type: 'obd/fetchObdList',
            payload: { ...this.state.formValues },
          });
        } else {
          message.error('添加失败');
        }
        this.handleModalVisible();
      },
    });
  };
  // 编辑车辆信息确定按钮
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'obd/fetchObdUpdate',
      payload: {
        ...fields,
      },
      callback: res => {
        if (res.code == '000000') {
          message.success('添加成功');
          dispatch({
            type: 'obd/fetchObdList',
            payload: { ...this.state.formValues },
          });
        } else {
          message.error('添加失败');
        }
        this.handleUpdateModalVisible();
      },
    });
  };
  //
  handleDetail = fields => {
    message.success('配置成功');
    this.handleDetailModalVisible();
  };
  renderSimpleForm() {
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
                  allowClear
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="sim卡号">{getFieldDecorator('imei', {})(<Input />)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车牌号">{getFieldDecorator('plateNo', {})(<Input />)}</FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="车架号">{getFieldDecorator('vin', {})(<Input />)}</FormItem>
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
      obd: { obdList },
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      detailModalVisible,
      stepFormValues,
      detailFormValues,
      localFormValues,
      localModalVisible,
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
    // 位置轨迹
    const localMethods = {
      handleLocalModalVisible: this.handleLocalModalVisible,
      // handleLocal: this.handleLocal,
    };

    return (
      <PageHeaderWrapper title="OBD列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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
              data={obdList}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey={record => record.id}
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

        {localFormValues && Object.keys(localFormValues).length ? (
          <LocalModel
            {...localMethods}
            localModalVisible={localModalVisible}
            values={localFormValues}
            dispatch={this.props.dispatch}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
