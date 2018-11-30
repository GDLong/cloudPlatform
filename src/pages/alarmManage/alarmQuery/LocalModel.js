import React, { PureComponent } from 'react';
import { Form, DatePicker, Modal, Button, message } from 'antd';
import BMap from 'BMap';
import coordtransform from 'coordtransform';
import styles from './ObdBmap.less';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
class CustomizedForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMap: '', //是否循环轨迹
      pathQuery: {},
    };
  }
  componentWillMount() {
    const { values } = this.props;
    var ismap = setInterval(() => {
      if (document.getElementById('Bmap')) {
        clearInterval(ismap);
        this.showIndexMap();
      } else {
        console.log('5');
      }
    }, 300);
  }
  componentWillUnmount() {
    clearInterval(this.state.isMap);
  }
  // 路径查询--默认--渲染地图
  showIndexMap() {
    var map = new BMap.Map('Bmap'); // 创建Map实例
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
    //添加地图类型控件
    map.addControl(
      new BMap.MapTypeControl({
        mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
      })
    );
    map.setCurrentCity('北京'); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
  }
  // 路径查询--轨迹--转化坐标
  mounthPoint(locationList) {
    const path = {
      points: [],
      queryProp: [],
    };
    for (var i = 0; i < locationList.length; i++) {
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
    this.createMap(path.queryProp, path.points);
  }
  //轨迹播放
  createMap(pathQuery, pathPoints) {
    const { isMap } = this.state;
    clearInterval(isMap);
    var _this = this;
    var arrPois = pathPoints;
    var map = new BMap.Map('Bmap', { enableMapClick: false });
    map.enableScrollWheelZoom();

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
      _this.setState({
        pathQuery: pathQuery[num],
      });
      if (num >= arrPois.length) {
        clearInterval(is_Map);
      }
    }, 1000);
    this.setState({
      isMap: is_Map,
    });
  }
  // 确定
  handleSubmit(e) {
    e.preventDefault();
    const { form, dispatch } = this.props;
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
      dispatch({
        type: 'obd/fetchObdLocation',
        payload: {
          iccid: '898607B8101790228766',
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
    });
  }
  render() {
    const { form, localModalVisible, handleLocalModalVisible } = this.props;
    const { pathQuery } = this.state;
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
    return (
      <Modal
        destroyOnClose //关闭时销毁 Modal 里的子元素
        title="位置轨迹"
        width={'65%'}
        visible={localModalVisible}
        footer={null}
        onCancel={() => handleLocalModalVisible()}
      >
        <Form layout="inline" onSubmit={e => this.handleSubmit(e)}>
          <FormItem label="选择时间">
            {form.getFieldDecorator('choseTime', {})(
              <RangePicker
                allowClear
                showTime={{ format: 'HH:mm:ss' }}
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: 300 }}
              />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </FormItem>
        </Form>
        <br />
        <div className={styles.markDynamicOut}>
          <div id="Bmap" className={styles.bmap} />
          {pathQuery && Object.keys(pathQuery).length ? <Dynamic dataProp={pathQuery} /> : null}
        </div>
      </Modal>
    );
  }
}
const CreateForm = Form.create()(CustomizedForm);

export default CreateForm;
