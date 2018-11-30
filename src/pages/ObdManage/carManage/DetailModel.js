import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  Modal,
  Divider,
  Button,
  message,
  Row,
  Col,
  DatePicker,
  Table,
  Popover,
} from 'antd';
import { connect } from 'dva';
import BMap from 'BMap';
import coordtransform from 'coordtransform';
import styles from './ObdBmap.less';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

// 地图展示
const MapShow = Form.create()(props => {
  const {
    pathQuery,
    form,
    showMap,
    pathLoop,
    isLoop,
    dispatch,
    isLoopFn,
    dataLoopFn,
    showMapFn,
  } = props;

  // 路径查询--默认--渲染地图
  if (showMap && pathQuery && Object.keys(pathQuery).length) {
    var lng = pathQuery.locationEntity.lng;
    var lat = pathQuery.locationEntity.lat;
    var wgs84togcj02 = coordtransform.wgs84togcj02(lng, lat);
    var gcj02tobd09 = coordtransform.gcj02tobd09(wgs84togcj02[0], wgs84togcj02[1]);
    var points = new BMap.Point(gcj02tobd09[0], gcj02tobd09[1]);

    var map = new BMap.Map('Bmap'); // 创建Map实例
    map.centerAndZoom(points, 11); // 初始化地图,设置中心点坐标和地图级别
    var marker = new BMap.Marker(points); // 创建标注
    map.addOverlay(marker); // 将标注添加到地图中
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
  }
  const Dynamic = data => {
    var item = data.dataProp;
    return (
      <div className={styles.markDynamic}>
        <p>
          接收时间：
          {item.rptutc}
        </p>
        <p>
          gps测速：
          {item.spd}
          km/h
        </p>
        <p>
          海拔高度：
          {item.att}米
        </p>
        <p>
          角度：
          {item.head}°
        </p>
        <p>
          位置：经
          {item.lng} &nbsp; 纬{item.lat}
        </p>
      </div>
    );
  };
  // 路径查询--轨迹--转化坐标
  const mounthPoint = locationList => {
    const path = {
      points: [],
      queryProp: [],
    };
    for (var i = 0; i < locationList.length; i++) {
      if (locationList[i].fix !== 0) {
        var wgs84togcj02 = coordtransform.wgs84togcj02(locationList[i].lng, locationList[i].lat);
        var gcj02tobd09 = coordtransform.gcj02tobd09(wgs84togcj02[0], wgs84togcj02[1]);
        var points = new BMap.Point(gcj02tobd09[0], gcj02tobd09[1]);

        var data = {
          lng: gcj02tobd09[0], //"经度"
          lat: gcj02tobd09[1], //"纬度"
          att: locationList[i].att, //"海拔高度"
          spd: locationList[i].spd, //"gps测速"
          head: locationList[i].head, //"角度"
          rptutc: locationList[i].rptutc, //上报时间"
        };

        path.queryProp.push(data);
        path.points.push(points);
      }
    }
    createMap(path.queryProp, path.points);
  };
  //轨迹播放
  const createMap = (pathQuery, pathPoints) => {
    showMapFn(false);
    clearInterval(isLoop);
    var arrPois = pathPoints;
    var map = new BMap.Map('Bmap', { enableMapClick: false });
    map.enableScrollWheelZoom(true);

    var icon = new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/car.png', new BMap.Size(52, 26), {
      anchor: new BMap.Size(27, 13),
    }); //声明公交icon
    var mkrBus = new BMap.Marker(arrPois[0], { icon: icon }); //声明公交标注
    map.addOverlay(mkrBus);
    // 画线
    map.addOverlay(new BMap.Polyline(arrPois, { strokeColor: '#111' }));
    map.setViewport(arrPois);

    var num = 0;
    const is_Map = setInterval(function() {
      num++;
      mkrBus.setPosition(arrPois[num]);
      dataLoopFn(pathQuery[num]);
      if (num >= arrPois.length) {
        clearInterval(is_Map);
      }
    }, 1000);
    isLoopFn(is_Map);
  };
  // 确定
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      var rangeValue = fieldsValue['choseTime'];
      if (rangeValue !== undefined && rangeValue.length !== 0) {
        rangeValue = [
          rangeValue[0].format('YYYY-MM-DD HH:mm:ss'),
          rangeValue[1].format('YYYY-MM-DD HH:mm:ss'),
        ];
      } else {
        rangeValue = ['', ''];
      }
      if (pathQuery && Object.keys(pathQuery).length) {
        dispatch({
          type: 'obd/fetchObdLocation',
          payload: {
            iccid: pathQuery.imei,
            startTime: rangeValue[0],
            endTime: rangeValue[1],
          },
          callback: res => {
            if (res.code === '000000') {
              if (res.locationList.length) {
                mounthPoint(res.locationList);
              } else {
                message.warning('未找到轨迹！');
              }
            } else {
              message.warning(res.msg);
            }
          },
        });
      } else {
        message.warning('暂无数据！！');
      }
    });
  };
  return (
    <Fragment>
      <Form layout="inline" onSubmit={e => handleSubmit(e)}>
        <Row type="flex" justify="space-between">
          <Col span={18}>
            <FormItem>
              {form.getFieldDecorator('choseTime')(
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
                轨迹查询
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <br />
      <div className={styles.markDynamicOut}>
        <div id="Bmap" className={styles.bmap} />
        {pathLoop && Object.keys(pathLoop).length ? <Dynamic dataProp={pathLoop} /> : null}
      </div>
    </Fragment>
  );
});
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
      isLoop: '', //是否循环轨迹
      pathLoop: {}, //循环的信息
      pathQuery: {}, //单选点击
      showMap: false,
      line: 0,
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
        this.setState({
          line: 0,
          pathQuery: res.list[0],
        });
      },
    });

    var ismap = setInterval(() => {
      if (document.getElementById('Bmap')) {
        clearInterval(ismap);
        this.setState({
          showMap: true,
        });
      } else {
        console.log('map');
      }
    }, 300);
  }
  componentWillUnmount() {
    clearInterval(this.state.isLoop);
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
      const values = {
        ...this.state.pagination,
        startTime: rangeValue[0],
        endTime: rangeValue[1],
        page: 1,
      };
      this.setState({
        pagination: values,
      });
      dispatch({
        type: 'obd/fetchObdSearchList',
        payload: values,
        callback: res => {
          this.setState({
            line: 0,
            pathQuery: res.list[0],
          });
        },
      });
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
    clearInterval(this.state.isLoop);
    this.setState({
      pathQuery: record,
      line: index,
      pathLoop: {},
      showMap: true,
    });
  };
  // 地图 emit 方法
  isLoopFn = flog => {
    this.setState({
      isLoop: flog,
    });
  };
  dataLoopFn = flog => {
    this.setState({
      pathLoop: flog,
    });
  };
  showMapFn = flog => {
    this.setState({
      showMap: !!flog,
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
    const { pathQuery, showMap, pathLoop, isLoop } = this.state;
    const mapMonth = {
      isLoopFn: this.isLoopFn,
      dataLoopFn: this.dataLoopFn,
      showMapFn: this.showMapFn,
    };
    return (
      <Modal
        destroyOnClose //关闭时销毁 Modal 里的子元素
        title="查询obd数据"
        width={900}
        visible={detailModalVisible}
        maskClosable={false}
        footer={null}
        onCancel={() => handleDetailModalVisible()}
      >
        <Fragment>
          <Row gutter={24}>
            <Col span={10}>
              <Form layout="inline" onSubmit={this.handleTable}>
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
              <br />
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
              <MapShow
                {...mapMonth}
                pathQuery={pathQuery}
                showMap={showMap}
                pathLoop={pathLoop}
                isLoop={isLoop}
                dispatch={this.props.dispatch}
              />
            </Col>
          </Row>
        </Fragment>
      </Modal>
    );
  }
}

const DetailModel = Form.create()(CustomizedForm);
export default DetailModel;
