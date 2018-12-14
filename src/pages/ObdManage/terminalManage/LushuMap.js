import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Button,
  message,
  DatePicker,
  Select
} from 'antd';
import { connect } from 'dva';
import BMap from 'BMap';
import coordtransform from 'coordtransform';
import DatePickerTime from '@/components/DatePickerTime';
import '@/utils/LuShu';
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
      loopDataLocal: {}, //当前回放的定位详情
      loopData: [], //轨迹定位详情数组
      loopPath: [], //轨迹点数组
      localNo:0,//当前的点
      map:{},
      //////////////////////////////
      lushu:{}
    };
  }
  componentWillReceiveProps(nextProps) {
    this.defaultMap();
  }
  componentWillUnmount() {
    const { lushu } = this.state;
    if (lushu && Object.keys(lushu).length) {
      this.resetLushu()
    }
  }
  // 路径查询--默认--渲染地图
  defaultMap = () => {
    const { pointClick } = this.props;
    const {lushu} = this.state;
    if (lushu && Object.keys(lushu).length) {
      this.resetLushu()
    }
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
          map.centerAndZoom(points, 15); // 初始化地图,设置中心点坐标和地图级别
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
    //声明公交icon
    // var icon = new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/car.png', new BMap.Size(52, 26), { anchor: new BMap.Size(27, 13) }); 
    // var mkrBus = new BMap.Marker(arrPois[0], { icon: icon }); //声明公交标注
    // map.addOverlay(mkrBus);
    // 画线
    map.addOverlay(new BMap.Polyline(arrPois, { strokeColor: '#111' }));
    map.setViewport(arrPois);
    this.setState(prevState => ({
      map:map
    }));
    this.lushuPlay();
  };
  // 轨迹播放+++重置循环+++
  lushuPlay = () => {
    const { lushu, loopData, loopPath ,map} = this.state;
    if (lushu && Object.keys(lushu).length){
      this.resetLushu()
    }
    var _this = this;
    var lushuBack = new BMapLib.LuShu(map, loopPath, {
      defaultContent: "",
      autoView: true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
      icon: new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/car.png', new BMap.Size(52, 26), { anchor: new BMap.Size(27, 13) }),
      speed: 500,
      enableRotation: true,//是否设置marker随着道路的走向进行旋转
      landmarkPois: [
        { lng: 116.368287, lat: 39.951169, html: '高速公路收费<div><img src="http://map.baidu.com/img/logo-map.gif"/></div>', pauseTime: 3 }
      ],
      callback:function (num) {
        _this.dataLoopFn(loopData[num],num); //刷新位置详情
      }
    });
    this.setState(prevState => ({ lushu: lushuBack}));
  };
  lushuStart = ()=>{
    const { lushu, map, loopPath, localNo} = this.state;
    map.centerAndZoom(loopPath[localNo], 15);
    lushu.start();
  }
  lushuPause = ()=>{
    const { lushu } = this.state
    lushu.pause()
  }
  lushuStop = ()=>{
    const { lushu } = this.state
    lushu.stop()
  }
  dataLoopFn = (data,index) => {
    this.setState(prevState => ({
      loopDataLocal: data,
      localNo:index
    }));
  };
  // 确定
  handleSubmit = (record) => {
    const { pointClick, dispatch } = this.props;    
    if (pointClick && Object.keys(pointClick).length) {
      //判断右边列表点击有没有参数传过来
      dispatch({
        type: 'obd/fetchObdLocation',
        payload: {
          iccid: pointClick.imei,
          ...record
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
  };
  // 切换速度
  handleSpeed = value => {
    const {lushu} = this.state
    switch (value) {
      case 1: //快放x2
        lushu._opts.speed = 2000
        break;
      case 2: //快放x1.5
        lushu._opts.speed = 1000
        break;
      case 4: //慢放x1.5
        lushu._opts.speed = 350
        break;
      case 5: //慢放x2
        lushu._opts.speed = 150
        break;
      default:
        //正常
        lushu._opts.speed = 500
        break;
    }
  };
  // 重置播放轨迹
  resetLushu = flages => {
    // ***1：初始化，2：切换速度，3：回放完成
    const { lushu } = this.state
    lushu.stop()
    this.setState(prevState => ({
        loopDataLocal:{},
        lushu:{}
    }))
  };
  render() {
    const { loopDataLocal,lushu} = this.state;
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
        <DatePickerTime handleTable={this.handleSubmit} title="轨迹查询"/>
        <br />
        <div className={styles.markDynamicOut}>
          <div id="Bmap" className={styles.bmap} />
          {loopDataLocal && Object.keys(loopDataLocal).length ? (
            <Dynamic dataProp={loopDataLocal} />
          ) : null}
        </div>
        {lushu && Object.keys(lushu).length ?
          <div>
            <Button type="primary" size="small" className={styles.operateBtn} onClick={this.lushuStart}>开始</Button>
            <Button type="default" size="small" className={styles.operateBtn} onClick={this.lushuPause}>暂停</Button>
            <Button type="danger" size="small" className={styles.operateBtn} onClick={this.lushuStop}>停止</Button>
            <Select defaultValue={3} style={{ width: 120 }} onChange={this.handleSpeed}  size="small">
              <Select.Option value={1}>快速播放x2</Select.Option>
              <Select.Option value={2}>快速播放x1.5</Select.Option>
              <Select.Option value={3}>正常播放</Select.Option>
              <Select.Option value={4}>慢速播放x1.5</Select.Option>
              <Select.Option value={5}>慢速播放x2</Select.Option>
            </Select>
          </div>
        :null}
      </Fragment>
    );
  }
}

export default LushuMap;
