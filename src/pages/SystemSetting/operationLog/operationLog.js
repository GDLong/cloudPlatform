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
  Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './operationLog.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const statusMap = ['success', 'error'];
const status = ['启用', '关闭'];

/* eslint react/no-multi-comp:0 */
@connect(({ loading, system }) => ({
  system,
  loading: loading.effects['system/fetchQueryLog'],
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    formValues: {
      page: '1',
      pageSize: '10',
      startTime: '',
      endTime: '',
    },
  };

  columns = [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      key: 'index',
    },
    {
      title: '操作人',
      dataIndex: 'userName',
      key: 'userName',
    },
    // , {
    //     title: '状态',
    //     dataIndex: 'inUse',
    //     key: 'inUse',
    //     render(val) {
    //         return <Badge status={statusMap[val]} text={status[val]} />;
    //     },
    // }
    {
      title: '修改时间',
      dataIndex: 'gmt_modified',
      key: 'gmt_modified',
    },
    {
      title: '请求接口',
      dataIndex: 'actionURL',
      key: 'actionURL',
    },
    {
      title: '操作类型',
      dataIndex: 'operateType',
      key: 'operateType',
    },
    {
      title: '操作类型名称',
      dataIndex: 'typeName',
      key: 'typeName',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'system/fetchQueryLog',
      payload: formValues,
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
      type: 'system/fetchQueryLog',
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
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'system/fetchQueryLog',
        payload: values,
      });
    });
  };
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="选择时间">
                            {getFieldDecorator('chooseTime', {})(<RangePicker allowClear showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" style={{ width: "100%" }} />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="IMEI">
                            {getFieldDecorator('imei', {})(<Input />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="车牌号">
                            {getFieldDecorator('plateNo', {})(<Input />)}
                        </FormItem>
                    </Col>
                </Row> */}
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* <Col md={8} sm={24}>
                        <FormItem label="SIM卡号">
                            {getFieldDecorator('sim', {})(<Input />)}
                        </FormItem>
                    </Col> */}
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
      system: { queryLog },
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper title="操作日志">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableList}>
              <Table
                loading={loading}
                dataSource={queryLog.list}
                columns={this.columns}
                pagination={queryLog.pagination}
                onChange={this.handleStandardTableChange}
                rowKey={record => record.id}
              />
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
