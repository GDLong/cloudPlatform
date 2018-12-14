import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Button, DatePicker, Table, Input } from 'antd';
import { getAccess } from '@/utils/accessFunctions';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DetailModel from './DetailModel';

import styles from './warnList.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

/* eslint react/no-multi-comp:0 */
@connect(({ loading, warning, menuTree }) => ({
  loading: loading.models.warning,
  warning,
  menuTree: menuTree.menuData,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    access: {},
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
    detailFormValues: {},
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
          {this.state.access &&
          Object.keys(this.state.access).length &&
          this.state.access.hasOwnProperty('queryAlarmData') ? (
            <a onClick={() => this.handleDetailModalVisible(true, record)}>
              {this.state.access.queryAlarmData.name}
            </a>
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
      type: 'warning/fetchWarningList',
      payload: formValues
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
          rangeValue[0].format('YYYY-MM-DD') + " 00:00:01",
          rangeValue[1].format('YYYY-MM-DD') + " 23:59:59",
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
  // 查看设备详情
  handleDetailModalVisible = (flag, record) => {
    this.setState({
      detailModalVisible: !!flag,
      detailFormValues: record || {},
    });
  };
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { access } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="选择时间">
              {getFieldDecorator('chooseTime', {})(
                <RangePicker
                  allowClear
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="SIM卡号">{getFieldDecorator('imei', {})(<Input />)}</FormItem>
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
              {access && Object.keys(access).length && access.hasOwnProperty('queryVehicleList') ? (
                <Button type="primary" htmlType="submit">
                  {access.queryVehicleList.name}
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

  render() {
    const {
      loading,
      warning: { warningLists },
    } = this.props;
    const { detailModalVisible, detailFormValues, access } = this.state;
    // console.log(access)

    // 查看
    const detailMethods = {
      handleDetailModalVisible: this.handleDetailModalVisible,
      handleDetail: this.handleDetail,
    };

    return (
      <PageHeaderWrapper title="报警列表">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <div className={styles.tableList}>
            {warningLists && Object.keys(warningLists).length ? (
              <Table
                loading={loading}
                dataSource={warningLists.list}
                columns={this.columns}
                pagination={warningLists.pagination}
                onChange={this.handleStandardTableChange}
                rowKey={record => record.id}
              />
            ) : null}
          </div>
        </Card>
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
