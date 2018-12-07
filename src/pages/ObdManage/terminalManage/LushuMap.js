import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Icon,
  Modal,
  Slider,
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
import carImg from '@/assets/car.png';
import styles from './ObdBmap.less';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ obd, loading }) => ({
  obd,
  loading: loading.effects['obd/fetchObdSearchList'], //loading.models.obd,
}))
@Form.create()
class LushuMap extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loopNumber: 0, //当前回放到第几个点
      loopDataLocal: {}, //当前回放的定位详情
      loopData: [], //轨迹定位详情数组
      loopPath: [], //轨迹点数组
      speed: 1000, //回放速度
      mkrBus: {}, //地图标注对象
    };
  }
  componentWillReceiveProps(nextProps) {
    this.defaultMap();
  }
  componentWillUnmount() {
    this.resetLushu(1);
  }
  // 路径查询--默认--渲染地图
  defaultMap = () => {
    const { pointClick } = this.props;
    this.resetLushu(1);
    var ismap = setInterval(() => {
      if (document.getElementById('Bmap')) {
        clearInterval(ismap);
        if (pointClick && Object.keys(pointClick).length) {
          var lng = pointClick.locationEntity.lng;
          var lat = pointClick.locationEntity.lat;
          var wgs84togcj02 = coordtransform.wgs84togcj02(lng, lat);
          var gcj02tobd09 = coordtransform.gcj02tobd09(wgs84togcj02[0], wgs84togcj02[1]);
          var points = new BMap.Point(gcj02tobd09[0], gcj02tobd09[1]);

          var map = new BMap.Map('Bmap'); // 创建Map实例
          map.centerAndZoom(points, 11); // 初始化地图,设置中心点坐标和地图级别
          var marker = new BMap.Marker(points); // 创建标注
          map.addOverlay(marker); // 将标注添加到地图中
          map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        }
      } else {
        console.log('map');
      }
    }, 300);
  };
  // 路径查询--轨迹--转化坐标
  mounthPoint = locationList => {
    this.resetLushu(3);
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
    this.setState({
      loopData: path.queryProp,
      loopPath: path.points,
    });
    this.createMap(path.points);
  };
  //轨迹播放
  createMap = pathPoints => {
    if (!pathPoints.length) {
      message.warning('没有可用的点！！');
      return;
    }
    var arrPois = pathPoints;
    var map = new BMap.Map('Bmap', { enableMapClick: false });
    map.enableScrollWheelZoom(true);

    var icon = new BMap.Icon(carImg, new BMap.Size(26, 26), {
      anchor: new BMap.Size(13, 13),
    }); //声明公交icon
    var mkrBus = new BMap.Marker(arrPois[0], { icon: icon }); //声明公交标注
    map.addOverlay(mkrBus);
    // 画线
    map.addOverlay(new BMap.Polyline(arrPois, { strokeColor: '#111' }));
    map.setViewport(arrPois);
    this.setState(prevState => ({
      mkrBus: mkrBus,
    }));
    this.lushuPlay();
  };
  // 轨迹播放+++重置循环+++
  lushuPlay = () => {
    const { loopNumber, loopData, loopPath, speed, mkrBus } = this.state;
    let num = loopNumber;
    this.interval = setInterval(() => {
      console.log('interval', loopNumber);
      num = num + 1;
      this.setState(prevState => ({ loopNumber: prevState.loopNumber + 1 }));
      mkrBus.setPosition(loopPath[num]); //描点
      this.dataLoopFn(loopData[num]); //刷新位置详情
      if (num >= loopPath.length) {
        this.resetLushu(3);
      }
    }, speed);
  };
  dataLoopFn = data => {
    this.setState(prevState => ({
      loopDataLocal: data,
    }));
  };
  // 确定
  handleSubmit = e => {
    const { pointClick, dispatch, form } = this.props;
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
      if (pointClick && Object.keys(pointClick).length) {
        //判断右边列表点击有没有参数传过来
        dispatch({
          type: 'obd/fetchObdLocation',
          payload: {
            iccid: pointClick.imei,
            startTime: rangeValue[0],
            endTime: rangeValue[1],
          },
          callback: res => {
            if (res.code === '000000') {
              if (res.locationList.length) {
                this.mounthPoint(res.locationList);
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
  // 切换速度
  handleSpeed = value => {
    switch (value) {
      case 1: //慢放x2
        this.setState({
          speed: 2000,
        });
        this.resetLushu(2);
        this.lushuPlay();
        break;
      case 2: //慢放x1
        this.setState({
          speed: 1500,
        });
        this.resetLushu(2);
        this.lushuPlay();
        break;
      case 4: //快放x1
        this.setState({
          speed: 750,
        });
        this.resetLushu(2);
        this.lushuPlay();
        break;
      case 5: //快放x2
        this.setState({
          speed: 500,
        });
        this.resetLushu(2);
        this.lushuPlay();
        break;

      default:
        //正常
        this.setState({
          speed: 1000,
        });
        this.resetLushu(2);
        this.lushuPlay();
        break;
    }
  };
  // 重置循环
  resetLushu = flages => {
    // ***1：初始化，2：切换速度，3：回放完成
    this.interval && clearInterval(this.interval);
    if (flages == 1) {
      this.setState({
        loopNumber: 0, //当前回放到第几个点
        loopDataLocal: {}, //当前回放的定位详情
        loopData: [], //轨迹定位详情数组
        loopPath: [], //轨迹点数组
        speed: 1000, //回放速度
        mkrBus: {}, //地图标注对象
      });
    } else if (flages == 3) {
      this.setState({
        loopNumber: 0, //当前回放到第几个点
        loopDataLocal: {}, //当前回放的定位详情
        loopData: [], //轨迹定位详情数组
        loopPath: [], //轨迹点数组
        speed: 1000, //回放速度
      });
    }
  };
  render() {
    const { loopDataLocal, speed } = this.state;
    const { form } = this.props;
    const Dynamic = data => {
      var item = data.dataProp;
      return (
        <Fragment>
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
        </Fragment>
      );
    };
    return (
      <Fragment>
        <Form layout="inline" onSubmit={e => this.handleSubmit(e)}>
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
          {loopDataLocal && Object.keys(loopDataLocal).length ? (
            <Dynamic dataProp={loopDataLocal} />
          ) : null}
        </div>

        {loopDataLocal && Object.keys(loopDataLocal).length ? (
          <div className={styles.sliderWrapper}>
            <Icon type="fast-backward" className={styles.flag} />
            <Slider
              defaultValue={3}
              max={5}
              min={1}
              marks={{ 1: 'x2', 2: 'x1', 3: '正常', 4: 'x1', 5: 'x2' }}
              tooltipVisible={false}
              onChange={this.handleSpeed}
            />
            <Icon type="fast-forward" className={styles.flag} />
          </div>
        ) : null}
      </Fragment>
    );
  }
}

export default LushuMap;
