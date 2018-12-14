import React, { PureComponent, Fragment } from 'react';
import { Form, Modal, Button, message, Row, Col, DatePicker, Table, Popover } from 'antd';
import { connect } from 'dva';
import DatePickerTime from '@/components/DatePickerTime';
import LushuMap from './LushuMap';
import moment from 'moment';
const FormItem = Form.Item;


@connect(({ obd, loading }) => ({
  obd,
  loading: loading.effects['obd/fetchObdSearchList'], //loading.models.obd,
}))
class CustomizedForm extends PureComponent {
  columns = [
    {
      title: '更新时间',
      dataIndex: 'uploadTime',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Popover
            content={
              <div>
                {record.obdEntity && Object.keys(record.obdEntity).length ? (
                  <div>
                    <p>
                      发动机转速：
                      {record.obdEntity.rpm || ''}
                    </p>
                    <p>
                      当前车速：
                      {record.obdEntity.vss || ''}
                    </p>
                    <p>
                      当前发动机温度：
                      {record.obdEntity.ect || ''}
                    </p>
                    <p>
                      发动机机油温度：
                      {record.obdEntity.eot || ''}
                    </p>
                    <p>
                      机油压力：
                      {record.obdEntity.eop || ''}
                    </p>
                    <p>
                      节气门开度：
                      {record.obdEntity.tp || ''}
                    </p>
                    <p>
                      蓄电池电压：
                      {record.obdEntity.bp || ''}
                    </p>
                    <p>
                      负载百分比：
                      {record.obdEntity.pct || ''}
                    </p>
                  </div>
                ) : null}
              </div>
            }
            title="obd诊断数据"
            placement="right"
          >
            <a>诊断详情</a>
          </Popover>
        </Fragment>
      ),
    },
  ];
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        page: '1',
        pageSize: '10',
        startTime: '',
        endTime: '',
      },
      pathQuery: {}, //单选点击
      line: 0,
      startTime:"",
      endTime:""
    };
  }
  componentWillMount() {
    const { values, dispatch } = this.props;
    var data = {
      ...this.state.pagination,
      imei: values.imei,
    };
    this.setState({
      pagination: data,
    });
    dispatch({
      type: 'obd/fetchObdSearchList',
      payload: {
        ...this.state.pagination,
        imei: values.imei,
      },
      callback: res => {
        if (res.code !== '000000') {
          message.warning(res.msg);
          return;
        }
        if (!res.list.length) {
          message.warning('未查到数据！！');
          return;
        }
        this.setState({
          line: 0,
          pathQuery: res.list[0],
        });
      },
    });
  }
  handleTable = (record) => {
    const { dispatch } = this.props;
    const values = {
      ...this.state.pagination,
      page: 1,
      ...record
    };
    this.setState({
      pagination: values,
    });
    dispatch({
      type: 'obd/fetchObdSearchList',
      payload: values,
      callback: res => {
        if (res.code !== "000000") { message.warning(res.msg); return }
        this.setState({
          line: 0,
          pathQuery: res.list[0],
        });
      },
    });
  };
  handleTableChange = (page, filters, sorter) => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    const params = {
      ...pagination,
      page: page.current,
      pageSize: page.pageSize,
    };
    this.setState({
      pagination: params,
    });

    dispatch({
      type: 'obd/fetchObdSearchList',
      payload: params,
      callback: res => {
        this.setState({
          line: 0,
          pathQuery: res.list[0],
        });
      },
    });
  };
  setClassName = (record, index) => {
    const { line } = this.state;
    return index === line ? 'cursorPoint lingColor' : 'cursorPoint';
  };
  handleRowClick = (record, index) => {
    this.setState({
      pathQuery: record,
      line: index,
    });
  };
  render() {
    const {
      detailModalVisible,
      handleDetailModalVisible,
      loading,
      form,
      obd: { searchList },
    } = this.props;
    const { pathQuery } = this.state;
    return (
      <Modal
        destroyOnClose //关闭时销毁 Modal 里的子元素
        title="查询obd数据"
        width={1150}
        visible={detailModalVisible}
        maskClosable={false}
        footer={null}
        onCancel={() => handleDetailModalVisible()}
      >
        <Fragment>
          <Row gutter={24}>
            <Col span={10}>
              <DatePickerTime handleTable={this.handleTable}/>
              <Table
                dataSource={searchList.list}
                columns={this.columns}
                pagination={searchList.pagination}
                onChange={this.handleTableChange}
                loading={loading}
                rowKey={record => record.gmt_id}
                size="small"
                style={{ marginTop: 20 }}
                rowClassName={this.setClassName} //#e6f7ff
                onRow={(record, index) => {
                  return {
                    onClick: () => {
                      this.handleRowClick(record, index);
                    },
                  };
                }}
              />
            </Col>
            <Col span={14}>
              <LushuMap pointClick={pathQuery} />
            </Col>
          </Row>
        </Fragment>
      </Modal>
    );
  }
}

const DetailModel = Form.create()(CustomizedForm);
export default DetailModel;
