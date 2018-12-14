import React, { PureComponent, Fragment } from 'react';
import { Form, Button, message, Row, Col, DatePicker} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

class CustomizedForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            startTime: "",
            endTime: ""
        };
    }
    componentWillMount() {}
    handleTable = e => {
        e.preventDefault();
        const { form, handleTable } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            if (!fieldsValue['startTime'] && !!fieldsValue['endTime']) { message.warning("请选择开始时间！！"); return }
            if (!!fieldsValue['startTime'] && !fieldsValue['endTime']) { message.warning("请选择结束时间！！"); return }
            var data = {
                startTime: fieldsValue['startTime'] ? fieldsValue['startTime'].format('YYYY-MM-DD HH:mm:ss') : "",
                endTime: fieldsValue['endTime'] ? fieldsValue['endTime'].format('YYYY-MM-DD HH:mm:ss') : "",
            }
            handleTable(data)            
        });
    };
    // ****开始时间的-部分
    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }
    startTimeonChange = (value, dateString) => {
        this.setState({
            startTime: dateString
        })
    }
    disabledStartDate = (current) => {
        const { endTime } = this.state;
        const minTime = moment(endTime).hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
        const maxTime = moment(endTime).add(1, 'days').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');

        if (endTime) {
            return current && current > moment(maxTime);//current < moment(minTime) ||
        } else {
            return current && current > moment();
        }
    }
    // ****end
    // ****结束时间的-部分
    endTimeonChange = (value, dateString) => {
        this.setState({
            endTime: dateString
        })
    }
    disabledEndDate = (current) => {
        const { startTime } = this.state;
        const minTime = moment(startTime).hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
        const maxTime = moment(startTime).add(1, 'days').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');

        if (startTime) {
            return current && current < moment(minTime) || current > moment(maxTime);
        } else {
            return current && current > moment();
        }
    }
    // ****end
    render() {
        const { form ,title} = this.props
        return (
            <Form layout="inline" onSubmit={this.handleTable}>
                <Row type="flex">
                    <Col style={{width:"185px"}}>
                        <FormItem>
                            {form.getFieldDecorator('startTime')(
                                <DatePicker
                                    placeholder="开始时间"
                                    showToday={false}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    disabledDate={this.disabledStartDate}
                                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                    onChange={this.startTimeonChange}
                                    style={{ width: "100%" }}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col style={{ width: "185px" }}>
                        <FormItem>
                            {form.getFieldDecorator('endTime')(
                                <DatePicker
                                    placeholder="结束时间"
                                    showToday={false}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    disabledDate={this.disabledEndDate}
                                    showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                                    onChange={this.endTimeonChange}
                                    style={{ width: "100%" }}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem>
                            <Button type="primary" htmlType="submit">{title || "查询"}</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const DatePickerTime = Form.create()(CustomizedForm);
export default DatePickerTime;
