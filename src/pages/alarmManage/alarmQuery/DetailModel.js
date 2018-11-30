import React, { PureComponent, Fragment } from 'react';
import { Form, Modal, Button, Tag, Row, Col, Table, DatePicker, Card, Spin, message } from 'antd';
import { connect } from 'dva';
import BMap from 'BMap';
import coordtransform from 'coordtransform';
import styles from './BMapLib.less';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ obd, loading }) => ({
  obd,
  loading: loading.effects['obd/fetchObdWarningList'],
}))
class CustomizedForm extends PureComponent {
  columns = [
    {
      title: '报警时间',
      dataIndex: 'rptutc',
    },
    {
      title: '报警等级',
      dataIndex: 'level',
      // render: (text, record) => <Tag color="volcano">{text}</Tag>
    },
    {
      title: '报警类型',
      dataIndex: 'alarmType',
      render: (text, record) => <Tag color="blue">{text == 0 ? '驾驶安全报警' : '车辆报警'}</Tag>,
    },
  ];
  constructor(props) {
    super(props);
    this.state = {
      line: 0,
      warninGrecord: {},
      pagination: {
        page: '1',
        pageSize: '10',
        startTime: '',
        endTime: '',
      },
    };
  }
  componentWillMount() {
    var _this = this;
    const { values, dispatch, handleDetailModalVisible } = this.props;
    var data = {
      ...this.state.pagination,
      imei: values.imei,
    };
    this.setState({
      pagination: data,
    });
    dispatch({
      type: 'obd/fetchObdWarningList',
      payload: data,
      callback: res => {
        if (res.alarmEntity.length) {
          this.setState(
            {
              warninGrecord: res.alarmEntity[0],
            },
            () => {
              var ismap = setInterval(() => {
                if (document.getElementById('Bmap')) {
                  clearInterval(ismap);
                  this.showIndexMap();
                } else {
                  console.log('地图dom未加载！！');
                }
              }, 300);
            }
          );
        } else {
          message.warning('未查到报警记录！！');
          handleDetailModalVisible();
        }
      },
    });
  }
  typeFormatter(type) {
    let warningType = '';
    switch (type) {
      case '1':
        warningType = '疲劳报警';
        break;
      case '2':
        warningType = '疲劳报警';
        break;
      case '3':
        warningType = '打电话报警';
        break;
      case '4':
        warningType = '吸烟报警';
        break;
      case '5':
        warningType = '驾驶员身份异常';
        break;
      case '6':
        warningType = '驾驶员丢失';
        break;

      default:
        warningType = '正常，解除报警';
        break;
    }
    return warningType;
  }
  showIndexMap() {
    const { warninGrecord } = this.state;
    const { values } = this.props;
    const type = this.typeFormatter(warninGrecord.type);

    var wgs84togcj02 = coordtransform.wgs84togcj02(warninGrecord.lng, warninGrecord.lat);
    var gcj02tobd09 = coordtransform.gcj02tobd09(wgs84togcj02[0], wgs84togcj02[1]);

    var map = new BMap.Map('Bmap', { enableMapClick: false }); // 创建Map实例
    var point = new BMap.Point(gcj02tobd09[0], gcj02tobd09[1]);
    map.centerAndZoom(point, 15); // 初始化地图,设置中心点坐标和地图级别
    //添加地图类型控件
    map.addControl(
      new BMap.MapTypeControl({
        mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
      })
    );
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    // 添加地图标示
    var myIcon = new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/car.png', new BMap.Size(52, 26));
    var marker = new BMap.Marker(point, { icon: myIcon });
    map.addOverlay(marker);
    var opts = {
      width: 250, // 信息窗口宽度
      height: 110, // 信息窗口高度
      // title: "海底捞王府井店", // 信息窗口标题
    };
    var innerText = `
            <div>车牌号：${values.plateNo}</div>
            <div>报警项目：${type}</div>
            <div>报警时间：${warninGrecord.rptutc}</div>
            <div>经度：${warninGrecord.lng}</div>
            <div>纬度：${warninGrecord.lat}</div>
        `;
    var infoWindow = new BMap.InfoWindow(innerText, opts); // 创建信息窗口对象
    marker.openInfoWindow(infoWindow); //开启信息窗口
    marker.addEventListener('click', function() {
      this.openInfoWindow(infoWindow); //开启信息窗口
    });
  }
  handleTable = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      var rangeValue = fieldsValue['rangeTime'];
      if (rangeValue !== undefined && rangeValue.length !== 0) {
        rangeValue = [
          rangeValue[0].format('YYYY-MM-DD HH:mm:ss'),
          rangeValue[1].format('YYYY-MM-DD HH:mm:ss'),
        ];
      } else {
        rangeValue = ['', ''];
      }

      var data = {
        ...this.state.pagination,
        page: 1,
        startTime: rangeValue[0],
        endTime: rangeValue[1],
      };
      this.setState({
        pagination: data,
      });
      dispatch({
        type: 'obd/fetchObdWarningList',
        payload: data,
        callback: res => {
          this.setState(
            {
              line: 0,
              warninGrecord: res.alarmEntity[0],
            },
            () => {
              this.showIndexMap();
            }
          );
        },
      });
    });
  };
  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const pager = { ...this.state.pagination };
    pager.page = pagination.current;
    this.setState({
      pagination: pager,
    });
    dispatch({
      type: 'obd/fetchObdWarningList',
      payload: pager,
      callback: res => {
        this.setState(
          {
            line: 0,
            warninGrecord: res.alarmEntity[0],
          },
          () => {
            this.showIndexMap();
          }
        );
      },
    });
  };
  setClassName = (record, index) => {
    const { line } = this.state;
    return index === line ? 'cursorPoint lingColor' : 'cursorPoint';
  };
  handleRowClick = (record, index) => {
    this.setState(
      {
        warninGrecord: record,
        line: index,
      },
      () => {
        this.showIndexMap();
      }
    );
  };
  render() {
    const {
      detailModalVisible,
      handleDetailModalVisible,
      loading,
      form,
      obd: { warningList },
    } = this.props;
    const { warninGrecord } = this.state;
    return (
      <Modal
        destroyOnClose //关闭时销毁 Modal 里的子元素
        title="报警详情"
        width={950}
        visible={detailModalVisible}
        maskClosable={false}
        style={{ top: 50 }}
        footer={null}
        onCancel={() => handleDetailModalVisible()}
      >
        <Fragment>
          <Row type="flex" gutter={24}>
            <Col span={10}>
              <Form onSubmit={this.handleTable} layout="inline">
                <Row type="flex" justify="space-between">
                  <Col span={18}>
                    <FormItem>
                      {form.getFieldDecorator('rangeTime')(
                        <RangePicker
                          allowClear
                          showTime={{ format: 'HH:mm:ss' }}
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <Table
                dataSource={warningList.alarmEntity}
                columns={this.columns}
                pagination={warningList.pagination}
                onChange={this.handleTableChange}
                loading={loading}
                rowKey={record => record.id}
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
              <Spin spinning={false}>
                <Card>
                  <div className={styles.uploadDiv}>
                    <img
                      className={styles.uploadImage}
                      src={'http://39.104.84.146:8888/' + warninGrecord.img}
                    />
                  </div>
                </Card>
                <div id="Bmap" style={{ height: 250 }} />
              </Spin>
            </Col>
          </Row>
        </Fragment>
      </Modal>
    );
  }
}

const DetailModel = Form.create()(CustomizedForm);
export default DetailModel;
