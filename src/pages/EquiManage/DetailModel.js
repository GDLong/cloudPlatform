import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  Select,
  Modal,
  Tabs,
  Divider,
  Button,
  message,
  Switch,
  Radio,
  Icon,
  Row,
  Col,
  DatePicker,
  Card,
  Tooltip as AntdTooltip,
  Table,
  Spin,
  Skeleton,
  InputNumber,
} from 'antd';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Tooltip,
  Util,
} from 'bizcharts';
import { ChartCard, Bar, WaterWave, Field } from '@/components/Charts';
import coordtransform from 'coordtransform';
import { connect } from 'dva';
import DataSet from '@antv/data-set';
import DescriptionList from '@/components/DescriptionList';
import BMap from 'BMap';
import styles from './EquiList.less';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const { Description } = DescriptionList;
const { RangePicker } = DatePicker;

// 设备详情
const TabPane1 = props => {
  const { equipmentInfo } = props;

  const switchFix = state => {
    if (state == 0) {
      return '未定位';
    } else if (state == 2) {
      return '2D定位';
    } else {
      return '3D定位';
    }
  };
  return (
    <Fragment>
      {equipmentInfo && Object.keys(equipmentInfo).length ? (
        <div>
          <DescriptionList size="large" title="基础信息" style={{ marginBottom: 20 }}>
            <Description term="ICCID">{equipmentInfo.device.iccid}</Description>
            <Description term="在线状态">
              {equipmentInfo.device.isOnline ? '在线' : '不在线'}
            </Description>
            <Description term="厂商">{equipmentInfo.device.deviceProducer}</Description>
            <Description term="是否可用">
              {equipmentInfo.device.inUse ? '不可用' : '可用'}
            </Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 20 }} />
          {equipmentInfo.location && Object.keys(equipmentInfo.location).length ? (
            <DescriptionList size="large" title="位置信息" style={{ marginBottom: 20 }}>
              <Description term="位置状态信息">{switchFix(equipmentInfo.location.fix)}</Description>
              <Description term="经度">{equipmentInfo.location.lng}</Description>
              <Description term="纬度">{equipmentInfo.location.lat}</Description>
              <Description term="海拔高度">{equipmentInfo.location.att + '米'}</Description>
              <Description term="gps测速">{equipmentInfo.location.spd + 'km/h'}</Description>
              <Description term="角度">{equipmentInfo.location.head + '°'}</Description>
              <Description term="定位卫星数">{equipmentInfo.location.sat}</Description>
              <Description term="上报时间">{equipmentInfo.location.rptutc}</Description>
            </DescriptionList>
          ) : (
            <DescriptionList size="large" title="位置信息" style={{ marginBottom: 20 }}>
              <Description term="位置状态信息">定位未上报</Description>
              <Description term="经度">经度未上报</Description>
              <Description term="纬度">经度未上报</Description>
              <Description term="海拔高度">0.00米</Description>
              <Description term="gps测速">0.00km/h</Description>
              <Description term="角度">0°</Description>
              <Description term="定位卫星数">0</Description>
              <Description term="上报时间">定位未上报</Description>
            </DescriptionList>
          )}
          <Divider style={{ marginBottom: 20 }} />
          <DescriptionList size="large" title="版本信息" style={{ marginBottom: 20 }}>
            <Description term="软件版本">{equipmentInfo.device.softwareVersion}</Description>
            <Description term="硬件版本">{equipmentInfo.device.hardwareVersion}</Description>
            <Description term="IMEI号">{equipmentInfo.device.imei}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 20 }} />
          <DescriptionList size="large" title="时间信息" style={{ marginBottom: 20 }}>
            <Description term="创建时间">{equipmentInfo.device.gmt_create}</Description>
            <Description term="更新时间">{equipmentInfo.device.gmt_modified}</Description>
          </DescriptionList>
        </div>
      ) : (
        <div>
          <Skeleton active />
          <Divider style={{ marginBottom: 20 }} />
          <Skeleton active />
          <Divider style={{ marginBottom: 20 }} />
          <Skeleton active />
        </div>
      )}
    </Fragment>
  );
};
// 实时数据
const TabPane2 = props => {
  const { tabsKey, realTimeData } = props;
  let elec = '',
    batteryState = [],
    cycleTimes = '';
  let dataTemp = [],
    dv = {},
    colsTemp = {}; //温度
  let current = [],
    colsCurrent = {}; //电流
  let coreVoltage = []; // 电压
  if (realTimeData && Object.keys(realTimeData).length) {
    current = realTimeData.list.map(item => {
      //电流
      var curr = {
        uploadTime: item.uploadTime,
        value: item.current,
      };
      return curr;
    });
    dataTemp = realTimeData.list.map(item => {
      //温度
      var temp = {
        uploadTime: item.uploadTime,
        bmsTemp1: item.bmsTemp1,
        bmsTemp2: item.bmsTemp2,
        coreTemp1: item.coreTemp1,
        coreTemp2: item.coreTemp2,
      };
      return temp;
    });
    coreVoltage = realTimeData.coreVoltage.map((item, index) => {
      var vol = {
        x: index,
        y: Number(item),
      };
      return vol;
    }); //电压
    elec = realTimeData.elec; //电量
    batteryState = realTimeData.batteryState; //电池状态
    cycleTimes = realTimeData.cycleTimes; //循环次数
    // -----以上是数据源-----以下是数据格式----------//
    // 温度
    const ds = new DataSet();
    dv = ds.createView().source(dataTemp);
    dv.transform({
      type: 'fold',
      fields: ['bmsTemp1', 'bmsTemp2', 'coreTemp1', 'coreTemp2'],
      // 展开字段集
      key: 'items',
      // key字段
      value: 'temperature', // value字段
    });
    colsTemp = {
      uploadTime: {
        range: [0, 1],
      },
    };
    // 电流
    colsCurrent = {
      uploadTime: {
        range: [0, 1],
      },
    };
  }
  return (
    <Fragment>
      {realTimeData && Object.keys(realTimeData).length ? (
        <div>
          <Row gutter={24}>
            <Col xl={17} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
              <div>
                <div>
                  <ChartCard
                    title="电芯/BMS 温度"
                    action={
                      <AntdTooltip title="电芯/BMS 温度">
                        <Icon type="exclamation-circle-o" />
                      </AntdTooltip>
                    }
                    contentHeight={238}
                  >
                    <div>
                      <Chart height={238} data={dv} scale={colsTemp} forceFit>
                        <Legend />
                        <Axis name="uploadTime" />
                        <Axis
                          name="temperature"
                          label={{
                            formatter: val => `${val}°C`,
                          }}
                        />
                        <Tooltip
                          crosshairs={{
                            type: 'y',
                          }}
                        />
                        <Geom
                          type="line"
                          position="uploadTime*temperature"
                          size={2}
                          color={'items'}
                          shape={'smooth'}
                        />
                        <Geom
                          type="point"
                          position="uploadTime*temperature"
                          size={4}
                          shape={'circle'}
                          color={'city'}
                          style={{
                            stroke: '#fff',
                            lineWidth: 1,
                          }}
                        />
                      </Chart>
                    </div>
                  </ChartCard>
                </div>
              </div>
            </Col>
            <Col xl={7} lg={24} md={24} sm={24} xs={24}>
              <ChartCard
                title="电池状态"
                avatar={
                  <img
                    style={{ width: 30, height: 30 }}
                    src="https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png"
                    alt="indicator"
                  />
                }
                action={
                  <AntdTooltip title={batteryState.toString()}>
                    <Icon type="info-circle-o" />
                  </AntdTooltip>
                }
                total={() => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: batteryState[0] ? batteryState[0] + '...' : '正常',
                    }}
                  />
                )}
                footer={
                  <Field label={`当前充电循环次数：${cycleTimes}次`} /> //value={numeral(12423).format("0,0")}
                }
                style={{ marginBottom: 10 }}
              />
              <ChartCard
                title="剩余电量"
                action={
                  <AntdTooltip title="剩余电量">
                    <Icon type="exclamation-circle-o" />
                  </AntdTooltip>
                }
                total=""
                contentHeight={40}
              >
                <div style={{ textAlign: 'center' }}>
                  <WaterWave height={90} title="剩余电量" percent={elec} />
                </div>
              </ChartCard>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={24} sm={24} xs={24}>
              <ChartCard
                title="电芯电压"
                action={
                  <AntdTooltip title="电芯电压">
                    <Icon type="exclamation-circle-o" />
                  </AntdTooltip>
                }
                contentHeight={200}
              >
                <Bar height={190} data={coreVoltage} />
              </ChartCard>
            </Col>
            <Col xl={12} lg={24} sm={24} xs={24}>
              <ChartCard
                title="电流"
                action={
                  <AntdTooltip title="电流信息">
                    <Icon type="exclamation-circle-o" />
                  </AntdTooltip>
                }
                contentHeight={200}
              >
                <div style={{ position: 'relative', top: '60px', right: '30px' }}>
                  <Chart height={260} data={current} scale={colsCurrent} forceFit>
                    <Axis name="uploadTime" />
                    <Axis name="value" />
                    <Tooltip
                      crosshairs={{
                        type: 'y',
                      }}
                    />
                    <Geom type="line" position="uploadTime*value" shape={'smooth'} size={2} />
                    <Geom
                      type="point"
                      position="uploadTime*value"
                      size={4}
                      shape={'circle'}
                      style={{
                        stroke: '#fff',
                        lineWidth: 1,
                      }}
                    />
                  </Chart>
                </div>
              </ChartCard>
            </Col>
          </Row>
        </div>
      ) : (
        <div>
          <Row gutter={24}>
            <Col xl={17} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
              <div>
                <Skeleton active paragraph={{ rows: 6 }} />
              </div>
            </Col>
            <Col xl={7} lg={24} md={24} sm={24} xs={24}>
              <Skeleton active />
              <Skeleton active />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={24} sm={24} xs={24}>
              <Skeleton active />
            </Col>
            <Col xl={12} lg={24} sm={24} xs={24}>
              <Skeleton active />
            </Col>
          </Row>
        </div>
      )}
    </Fragment>
  );
};
// 命令调试-3-1
class TabPane3_1 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { tabsKey, form, handleTimeChange, isTime, handleTimeSubmit } = this.props;
    const handleSubmit = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        handleTimeSubmit(fieldsValue);
      });
    };
    const handleReset = () => {
      form.resetFields();
      handleTimeChange(false);
    };
    const handleChange = value => {
      if (value === '0') {
        handleTimeChange(false);
      } else {
        handleTimeChange(true);
      }
    };
    return (
      <Fragment>
        <Form>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="修改上报时间间隔">
            {form.getFieldDecorator('reportTime', {
              initialValue: '0',
            })(
              <Select placeholder="请选择!" onChange={handleChange}>
                <Option value="0">不修改上报时间</Option>
                <Option value="1">修改上报时间</Option>
              </Select>
            )}
          </FormItem>
          {isTime ? (
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上报时间间隔">
              {form.getFieldDecorator('time', {
                rules: [{ required: true, message: '请填写上报时间间隔！' }],
                initialValue: '1',
              })(
                <InputNumber
                  placeholder="单位分钟，范围1-100"
                  min={1}
                  max={100}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          ) : null}
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="租赁情况">
            {form.getFieldDecorator('rent', {
              initialValue: '0',
            })(
              <Select placeholder="请选择!">
                <Option value="0">禁止租赁</Option>
                <Option value="1">启用租赁</Option>
              </Select>
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="充电情况">
            {form.getFieldDecorator('charge', {
              initialValue: '0',
            })(
              <Select placeholder="请选择!">
                <Option value="0">允许充电</Option>
                <Option value="1">禁止充电</Option>
              </Select>
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="放电情况">
            {form.getFieldDecorator('discharge', {
              initialValue: '0',
            })(
              <Select placeholder="请选择!">
                <Option value="0">允许放电</Option>
                <Option value="1">禁止放电</Option>
              </Select>
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态查询">
            {form.getFieldDecorator('query', {
              initialValue: '0',
            })(
              <Select placeholder="请选择!">
                <Option value="0">不查询状态数据</Option>
                <Option value="1">查询状态数据</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <Button type="primary" onClick={handleSubmit}>
              发送
            </Button>
            <Button type="default" style={{ marginLeft: 8 }} onClick={handleReset}>
              重置
            </Button>
          </FormItem>
        </Form>
      </Fragment>
    );
  }
}
const TabPane3_1_1 = Form.create()(TabPane3_1);
// 命令调试-3-2--自定义--命令
class TabPane3_2 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { tabsKey, form, handleTimeSubmitDIY } = this.props;
    const handleSubmitDIY = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        handleTimeSubmitDIY(fieldsValue);
      });
    };
    const handleResetDIY = () => {
      form.resetFields();
    };
    return (
      <Fragment>
        <Form>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="自定义命令">
            {form.getFieldDecorator('dat', {
              rules: [{ required: true, message: '请填写自定义命令！' }],
            })(<Input.TextArea placeholder="自定义16进制串口报文命令..." rows={8} />)}
          </FormItem>
          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <Button type="primary" onClick={handleSubmitDIY}>
              发送
            </Button>
            <Button type="default" style={{ marginLeft: 8 }} onClick={handleResetDIY}>
              重置
            </Button>
          </FormItem>
        </Form>
      </Fragment>
    );
  }
}
const TabPane3_2_2 = Form.create()(TabPane3_2);
// 命令调试
const TabPane3 = Form.create()(props => {
  const { tabsKey, handleTimeChange, isTime, handleTimeSubmit, handleTimeSubmitDIY } = props;
  const state = {
    tabsKey,
    handleTimeChange,
    isTime,
    handleTimeSubmit,
    handleTimeSubmitDIY,
  };
  return (
    <Fragment>
      <Tabs defaultActiveKey="1" tabPosition="left">
        <TabPane tab="命令下发" key="1">
          <TabPane3_1_1 {...state} />
        </TabPane>
        <TabPane tab="自定义下发" key="2">
          <TabPane3_2_2 {...state} />
        </TabPane>
      </Tabs>
    </Fragment>
  );
});
// 路径查询
const TabPane4 = Form.create()(props => {
  const { tabsKey, form, pathSearch, pathQuery } = props;

  const handleSearch = () => {
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

      pathSearch(rangeValue);
    });
  };
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
    <Fragment>
      <Form layout="inline">
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label="选择时间">
              {form.getFieldDecorator('choseTime', {
                rules: [{ required: true, message: '请选择时间！！' }],
              })(
                <RangePicker
                  allowClear
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: 300 }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              <Button type="primary" onClick={handleSearch}>
                查询
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <br />
      <div className={styles.markDynamicOut}>
        {pathQuery && Object.keys(pathQuery).length ? <Dynamic dataProp={pathQuery} /> : null}
        <div className="mapContainer" id="mapContainer" style={{ height: '60vh' }} />
      </div>
    </Fragment>
  );
});
// 历史数据
const TabPane5 = Form.create()(props => {
  const {
    tabsKey,
    form,
    values,
    historicalData,
    historySearch,
    historyPageChange,
    historyRowClick,
    loading,
    handleRowData,
    line,
  } = props;
  const columns = [
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
    },
  ];
  const DescList = props => {
    //电芯电压组件
    var items = props.voltages;
    const desc = (
      <DescriptionList size="large" title="电芯电压" style={{ marginBottom: 20 }}>
        {items.map((item, index) => (
          <Description term={'电芯电压' + ++index} key={index}>
            {item + 'mV'}
          </Description>
        ))}
      </DescriptionList>
    );
    return <Fragment>{desc}</Fragment>;
  };
  const historySearchL = e => {
    //搜索
    e.preventDefault();
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

      historySearch(rangeValue);
    });
  };
  const handleRowClick = (record, index) => {
    historyRowClick(record, index);
  };
  const setClassName = (record, index) => {
    return index === line ? 'cursorPoint lingColor' : 'cursorPoint';
  };
  return (
    <Fragment>
      <Row gutter={24}>
        <Col span={8}>
          <Form layout="inline" onSubmit={historySearchL}>
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
                    确定
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <br />
          <Table
            columns={columns}
            dataSource={historicalData.list}
            pagination={historicalData.pagination}
            onChange={historyPageChange}
            loading={loading}
            size="small"
            rowKey={record => record.gmt_id}
            rowClassName={setClassName} //#e6f7ff
            onRow={(record, index) => {
              return {
                onClick: () => {
                  handleRowClick(record, index);
                },
              };
            }}
          />
        </Col>
        <Col span={16}>
          {handleRowData && Object.keys(handleRowData).length ? (
            <Fragment>
              <DescriptionList size="large" title="电芯/BMS 温度" style={{ marginBottom: 20 }}>
                <Description term="电芯温度1">{handleRowData.coreTemp1 + '°C'}</Description>
                <Description term="电芯温度2">{handleRowData.coreTemp2 + '°C'}</Description>
                <Description term="BMS温度1">{handleRowData.bmsTemp1 + '°C'}</Description>
                <Description term="BMS温度2">{handleRowData.bmsTemp2 + '°C'}</Description>
              </DescriptionList>
              <Divider style={{ marginBottom: 20 }} />
              <DescList voltages={handleRowData.voltage} />
              <Divider style={{ marginBottom: 20 }} />
              <DescriptionList size="large" title="基础信息" style={{ marginBottom: 20 }}>
                <Description term="电池状态">
                  {handleRowData.state[0] ? handleRowData.state[0] + '...  ' : '正常 '}
                  {handleRowData.state[0] ? (
                    <AntdTooltip title={JSON.stringify(handleRowData.state)}>
                      <Icon type="exclamation-circle-o" />
                    </AntdTooltip>
                  ) : null}
                </Description>
                <Description term="剩余电量">{handleRowData.elec + '%'}</Description>
                <Description term="当前电流">{handleRowData.current + 'A'}</Description>
                <Description term="循环次数">{handleRowData.cycleTimes + '次'}</Description>
              </DescriptionList>
            </Fragment>
          ) : null}
        </Col>
      </Row>
    </Fragment>
  );
});
//
@connect(({ bms, loading }) => ({
  bms,
  loading: loading.models.bms,
}))
//
class CustomizedForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabsKey: '',
      isCycle: '', //是否循环实时数据
      isMap: '', //是否循环轨迹
      isTime: false, //是否显示上报时间
      //
      equipmentInfo: {}, //设备详情
      realTimeData: {}, //实时数据
      debuggingCommands: {}, //命令调试
      pathQuery: {}, //路径查询--对象数组
      // pathQueryPoints: {},//路径查询--坐标数组
      historicalData: {}, //历史数据
      handleRowData: [], //历史数据--动态数据
      line: '', //当前选中的行——-下标
      formValues: {
        page: '1',
        pageSize: '10',
        startTime: '',
        endTime: '',
        iccid: '',
      },
    };
  }
  componentWillMount() {
    const { values, dispatch } = this.props;
    const pageValues = this.state.formValues;
    const flag = {
      ...pageValues,
      iccid: values.iccid,
    };
    this.setState({
      formValues: flag,
    });
    // 查询BMS设备详情信息
    dispatch({
      type: 'bms/fetchBmsDeviceDetail',
      payload: {
        iccid: values.iccid,
      },
      callback: res => {
        if (res.code !== '000000') {
          message.error(res.msg);
          this.cancelModel();
          return;
        }
        this.setState({
          equipmentInfo: res,
        });
      },
    });
  }
  componentWillUnmount() {
    clearInterval(this.state.isCycle);
    clearInterval(this.state.isMap);
  }
  tabHandleChange(key) {
    const { dispatch, values } = this.props;
    const { isCycle, isMap, equipmentInfo } = this.state;

    this.setState({ tabsKey: key });

    switch (key) {
      case '1':
        dispatch({
          type: 'bms/fetchBmsDeviceDetail',
          payload: {
            iccid: values.iccid,
          },
          callback: res => {
            this.setState({
              equipmentInfo: res,
            });
          },
        });
        break;
      case '2':
        dispatch({
          type: 'bms/fetchBmsRealTimeBatteryData',
          payload: {
            iccid: values.iccid,
          },
          callback: res => {
            if (res.code !== '000000') return message.warning(res.msg);
            if (!res.list.length) return message.warning('实时数据未上传！！');
            this.setState({
              realTimeData: res,
            });
          },
        });
        break;
      case '3':
        console.log(key);
        break;
      case '4':
        console.log(key);
        break;
      case '5':
        dispatch({
          type: 'bms/fetchBmsHistory',
          payload: {
            ...this.state.formValues,
          },
          callback: res => {
            this.setState({
              historicalData: res,
              handleRowData: res.list[0],
            });
          },
        });
        break;
      default:
        break;
    }

    var mapWrap = document.getElementById('mapContainer');
    var setTime = null;
    if (key === '4') {
      var bmapL = null;
      try {
        bmapL = {
          lat: equipmentInfo.location.lat,
          lng: equipmentInfo.location.lng,
        };
      } catch (error) {
        bmapL = {
          lat: '31.71592140',
          lng: '118.97496796',
        };
        message.warning('当前定位信息未上报！！');
      }
      if (mapWrap !== null) {
        this.showIndexMap(bmapL);
      } else {
        setTime = setInterval(() => {
          var mapWrapre = document.getElementById('mapContainer');
          if (mapWrapre !== null) {
            clearInterval(setTime);
            this.showIndexMap(bmapL);
          }
        }, 300);
      }
    } else {
      clearInterval(isMap);
      this.setState({
        pathQuery: {},
      });
    }

    if (key === '2') {
      clearInterval(isCycle);
      const cycle = setInterval(() => {
        dispatch({
          type: 'bms/fetchBmsRealTimeBatteryData',
          payload: {
            iccid: values.iccid,
          },
          callback: res => {
            if (res.code !== '000000') return message.warning(res.msg);
            if (!res.list.length) return message.warning('实时数据未上传！！');
            this.setState({
              realTimeData: res,
            });
            // try {
            //     this.setState({
            //         realTimeData: res
            //     })
            // } catch (error) {
            //     console.log("error",error)
            // }
          },
        });
      }, 15000);

      this.setState({
        isCycle: cycle,
      });
    } else {
      clearInterval(isCycle);
    }
  }
  // 命令下发---显示隐藏
  handleTimeChange = data => {
    this.setState({
      isTime: data,
    });
  };
  // 命令下发---请求接口
  handleTimeSubmit = fields => {
    const { values, dispatch } = this.props;
    fields.iccid = values.iccid;
    dispatch({
      type: 'bms/fetchBmsDeviceCommand',
      payload: fields,
      callback: res => {
        if (res.code === '000000') {
          message.success('下发成功！');
        } else {
          message.warning(res.msg);
        }
      },
    });
  };
  handleTimeSubmitDIY = fields => {
    const { values, dispatch } = this.props;
    fields.iccid = values.iccid;
    dispatch({
      type: 'bms/fetchBmsDeviceCommandFree',
      payload: fields,
      callback: res => {
        if (res.code === '000000') {
          message.success('下发成功！');
        } else {
          message.warning(res.msg);
        }
      },
    });
  };
  // 路径查询--默认--渲染地图
  showIndexMap(bmapL) {
    //bmapL
    var wgs84togcj02 = coordtransform.wgs84togcj02(bmapL.lng, bmapL.lat);
    var gcj02tobd09 = coordtransform.gcj02tobd09(wgs84togcj02[0], wgs84togcj02[1]);
    var mapL = {
      lng: gcj02tobd09[0],
      lat: gcj02tobd09[1],
    };
    var map = new BMap.Map('mapContainer', { enableMapClick: false }); // 创建Map实例
    map.centerAndZoom(new BMap.Point(mapL.lng, mapL.lat), 11); // 初始化地图,设置中心点坐标和地图级别
    // map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
    // map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    var marker = new BMap.Marker(new BMap.Point(mapL.lng, mapL.lat));
    map.addOverlay(marker);

    var navigationControl = new BMap.NavigationControl({
      // 靠左上角位置
      anchor: BMAP_ANCHOR_TOP_LEFT,
      // LARGE类型
      type: BMAP_NAVIGATION_CONTROL_LARGE,
      // 启用显示定位
      // enableGeolocation: true
    });
    map.addControl(navigationControl);
    // 添加定位控件
    var geolocationControl = new BMap.GeolocationControl();
    geolocationControl.addEventListener('locationSuccess', function(e) {
      map.centerAndZoom(new BMap.Point(mapL.lng, mapL.lat), 11);
    });
    geolocationControl.addEventListener('locationError', function(e) {
      // 定位失败事件
      alert(e.message);
    });
    map.addControl(geolocationControl);
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
    var map = new BMap.Map('mapContainer', { enableMapClick: false });
    map.enableScrollWheelZoom();

    var icon = new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/car.png', new BMap.Size(52, 26), {
      anchor: new BMap.Size(27, 13),
    }); //声明公交icon
    var mkrBus = new BMap.Marker(arrPois[0], { icon: icon }); //声明公交标注
    // var label = new BMap.Label("粤A30780", { offset: new BMap.Size(0, -30) });
    // label.setStyle({ border: "1px solid rgb(204, 204, 204)", color: "rgb(0, 0, 0)", borderRadius: "10px", padding: "3px 5px", background: "rgb(255, 255, 255)", });
    // mkrBus.setLabel(label);
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
  // 路径轨迹--检索
  pathSearch = fields => {
    const { dispatch, values } = this.props;
    const pathFormData = {
      iccid: values.iccid,
      startTime: fields[0],
      endTime: fields[1],
    };
    dispatch({
      type: 'bms/fetchBmsDeviceLocation',
      payload: pathFormData,
      callback: res => {
        if (res.code !== '000000') return;
        if (res.locationList.length) {
          this.mounthPoint(res.locationList);
        } else {
          message.warning('未检索到轨迹！！');
        }
      },
    });
  };
  // 历史数据--检索
  historySearch = fields => {
    const { dispatch } = this.props;
    const pager = {
      ...this.state.formValues,
      startTime: fields[0],
      endTime: fields[1],
    };
    this.setState({
      formValues: pager,
    });
    dispatch({
      type: 'bms/fetchBmsHistory',
      payload: pager,
      callback: res => {
        this.setState({
          historicalData: res,
          handleRowData: res.list[0],
        });
      },
    });
  };
  // 历史数据--分页
  historyPageChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const pager = { ...this.state.formValues };
    pager.page = pagination.current;
    this.setState({
      formValues: pager,
    });
    dispatch({
      type: 'bms/fetchBmsHistory',
      payload: pager,
      callback: res => {
        this.setState({
          historicalData: res,
          handleRowData: res.list[0],
          line: 0,
        });
      },
    });
  };
  // 历史数据--点击行
  historyRowClick = (row, index) => {
    this.setState({
      handleRowData: row,
      line: index,
    });
  };
  // 关闭Model
  cancelModel = () => {
    const { handleDetailModalVisible } = this.props;
    const { isCycle } = this.state;

    setTimeout(() => {
      handleDetailModalVisible();
    }, 0);
  };
  render() {
    const { detailModalVisible, loading } = this.props;
    const {
      tabsKey,
      equipmentInfo,
      historicalData,
      handleRowData,
      realTimeData,
      pathQuery,
      line,
      isTime,
    } = this.state;
    // 轨迹prop数据
    const path = {
      pathSearch: this.pathSearch,
    };
    // 命令下发
    const command = {
      handleTimeChange: this.handleTimeChange,
      handleTimeSubmit: this.handleTimeSubmit,
      handleTimeSubmitDIY: this.handleTimeSubmitDIY,
    };
    // 历史数据
    const history = {
      historySearch: this.historySearch,
      historyPageChange: this.historyPageChange,
      historyRowClick: this.historyRowClick,
    };
    return (
      <Modal
        destroyOnClose //关闭时销毁 Modal 里的子元素
        // title="设备详情"
        width={'70%'}
        style={{ top: 20 }}
        visible={detailModalVisible}
        footer={null}
        onCancel={() => this.cancelModel()}
      >
        <Tabs defaultActiveKey="1" type="card" onChange={e => this.tabHandleChange(e)}>
          <TabPane tab="设备详情" key="1">
            <Spin spinning={loading} delay={500}>
              <TabPane1 tabsKey={tabsKey} equipmentInfo={equipmentInfo} />
            </Spin>
          </TabPane>
          <TabPane tab="实时数据" key="2">
            <Spin spinning={loading} delay={500}>
              <TabPane2 tabsKey={tabsKey} realTimeData={realTimeData} />
            </Spin>
          </TabPane>
          <TabPane tab="命令调试" key="3">
            <Spin spinning={loading}>
              <TabPane3 tabsKey={tabsKey} isTime={isTime} {...command} />
            </Spin>
          </TabPane>
          <TabPane tab="路径查询" key="4">
            <Spin spinning={loading}>
              <TabPane4 tabsKey={tabsKey} pathQuery={pathQuery} {...path} />
            </Spin>
          </TabPane>
          <TabPane tab="历史数据" key="5">
            <TabPane5
              tabsKey={tabsKey}
              historicalData={historicalData}
              {...history}
              loading={loading}
              handleRowData={handleRowData}
              line={line}
            />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

const DetailModel = Form.create()(CustomizedForm);
export default DetailModel;
