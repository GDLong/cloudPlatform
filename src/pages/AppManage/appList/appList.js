import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Form, Modal, message, Input } from 'antd';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getAccess } from '@/utils/accessFunctions';

import styles from './appList.less';
const FormItem = Form.Item;

const CreateModel = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建应用"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});
@Form.create()
@connect(({ list, loading, menuTree }) => ({
  list,
  loading: loading.models.list,
  menuTree: menuTree.menuData,
}))

// @Form.create()
class CardList extends PureComponent {
  state = {
    access: {},
    modalVisible: false,
  };
  componentDidMount() {
    const {
      dispatch,
      location: { pathname },
      menuTree,
    } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });

    const access = getAccess(pathname, menuTree);
    this.setState({
      access: access.childRoutes || {},
    });
  }
  // 编辑应用
  editorApp(e, key) {
    e.preventDefault();
    alert(key);
  }
  // 删除应用
  removeApp(e, key) {
    e.preventDefault();
    alert(key);
  }
  // 设置白名单
  whiteApp(e, key) {
    e.preventDefault();
    alert(key);
  }
  // 新增应用
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleAdd = fields => {
    message.success('添加成功');
    this.handleModalVisible();
  };
  render() {
    const {
      list: { list },
      loading,
    } = this.props;
    const { modalVisible } = this.state;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，
          提供跨越设计与开发的体验解决方案。
        </p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            快速开始
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
            产品简介
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
            产品文档
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      // content={content} extraContent={extraContent}
      <PageHeaderWrapper title="应用列表">
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[...list, '']}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[
                      <a onClick={e => this.editorApp(e, item.id)}>编辑</a>,
                      <a onClick={e => this.whiteApp(e, item.id)}>白名单</a>,
                      <a onClick={e => this.removeApp(e, item.id)}>删除</a>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.cover} />}
                      // title={<a>{item.owner}</a>}
                      title="金邦动力"
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.subDescription}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button
                    type="dashed"
                    className={styles.newButton}
                    onClick={() => this.handleModalVisible(true)}
                  >
                    <Icon type="plus" /> 新增应用
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
        <CreateModel {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
