import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Button, Table, Badge, Icon, Divider, Popconfirm, message } from 'antd';
import { getAccess } from '@/utils/accessFunctions';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatId } from '@/utils/utils';
import EditorClass from './editorClass';
import EditorMenu from './editorMenu';

@connect(({ system, loading, menuTree }) => ({
  system,
  loading: loading.models.system,
  menuTree: menuTree.menuData,
}))
class CardList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      access: {},
      allMenu: {},
      editorValue: {},
      editorShow: false,
      editorValueMenu: {},
      editorShowMenu: false,
    };
  }
  columns = [
    { title: 'icon', key: 'icon', width: 100, render: record => <Icon type={record.icon} /> },
    { title: '菜单分组', dataIndex: 'parentName', key: 'parentName' },
    { title: '菜单类型', dataIndex: 'parentType', key: 'parentType' },
    { title: '创建时间', dataIndex: 'gmt_modified', key: 'gmt_modified' },
    {
      title: '操作',
      key: 'operation',
      width: 180,
      render: (text, record, index) => (
        <div>
          <a onClick={() => this.handleUpdateModalVisible(true, record, index)}>编辑分类</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除该选项么?"
            onConfirm={() => this.popConfirm(record)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];
  componentDidMount() {
    const {
      location: { pathname },
      menuTree,
    } = this.props;
    const access = getAccess(pathname, menuTree);
    this.setState({
      access: access.childRoutes || {},
    });

    this.reloadFn();
  }
  reloadFn() {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/fetchAllResource',
      callback: res => {
        if (res.code !== '000000') {
          message.warning(res.msg);
          return;
        }
        const menus = this.formatter(res.allMenu);
        this.setState({
          allMenu: menus,
        });
      },
    });
  }
  formatter = val => {
    const data = [];
    if (val && Object.keys(val).length) {
      Object.keys(val).forEach(key => {
        const obj = val[key];
        if (obj.child) {
          const child = this.formatter(obj.child);
          obj.child = child;
        }
        data.push(obj);
      });
    }
    return data;
  };
  // 编辑分类--start
  handleUpdateModalVisible = (flag, record, index) => {
    const data = {
      ...record,
      index,
    };
    this.setState({
      editorValue: data || {},
      editorShow: !!flag,
    });
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    if (fields.hasOwnProperty('diy')) {
      // 新建
      const { allMenu } = this.state;
      const allMenuCopy = allMenu;
      const data = {
        ...fields,
        gmt_modified: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        child: [],
      };
      if (fields.index == undefined) {
        allMenuCopy.push(data);
      } else {
        allMenuCopy.splice(fields.index, 1, data);
      }
      this.setState({
        allMenu: allMenuCopy,
      });
      this.handleUpdateModalVisible();
    } else {
      // 编辑
      dispatch({
        type: 'system/fetchUpdateFirstMenu',
        payload: fields,
        callback: res => {
          if (res.code !== '000000') message.warning(res.msg);
          if (res.code === '000000') message.success('修改成功！！');
          this.handleUpdateModalVisible();
          this.reloadFn();
        },
      });
    }
  };
  // 编辑分类--end
  // 编辑菜单--start
  handleUpdateModalVisibleMenu = (flag, record, parents) => {
    const data = {
      ...parents,
      ...(record || {}),
    };
    this.setState({
      editorValueMenu: data,
      editorShowMenu: !!flag,
    });
  };
  handleUpdateMenu = fields => {
    const { dispatch } = this.props;
    if (fields.hasOwnProperty('secondId')) {
      // 编辑
      dispatch({
        type: 'system/fetchUpdateResource',
        payload: fields,
        callback: res => {
          if (res.code !== '000000') {
            message.warning(res.msg);
            return;
          }
          if (res.code === '000000') message.success('编辑成功！！');
          this.handleUpdateModalVisibleMenu();
          this.reloadFn();
        },
      });
    } else {
      // 新增
      dispatch({
        type: 'system/fetchUpdateResource',
        payload: fields,
        callback: res => {
          if (res.code !== '000000') {
            message.warning(res.msg);
            return;
          }
          if (res.code === '000000') message.success('新增成功！！');
          this.handleUpdateModalVisibleMenu();
          this.reloadFn();
        },
      });
    }
  };
  // 编辑菜单--end
  // 删除分类
  popConfirm(record) {
    const { dispatch } = this.props;
    const keys = formatId(record);
    dispatch({
      type: 'system/fetchDeleteResource',
      payload: { allKeys: keys },
      callback: res => {
        if (res.code !== '000000') {
          message.warning(res.msg);
          return;
        }
        if (res.code === '000000') message.success('删除成功！！');
        this.reloadFn();
      },
    });
  }
  expandedRowRender = (record, index, indent, expanded) => {
    const parents = {
      parentName: record.parentName,
      parentType: record.parentType,
      icon: record.icon,
    };
    const column = [
      { title: '菜单名称', dataIndex: 'categoryName' },
      { title: '标识', dataIndex: 'category' },
      { title: '路由', dataIndex: 'categoryUrl' },
      {
        title: 'Status',
        key: 'state',
        render: () => (
          <span>
            <Badge status="success" />
            Finished
          </span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <div>
            <a onClick={() => this.handleUpdateModalVisibleMenu(true, record, parents)}>编辑菜单</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除该选项么?"
              onConfirm={() => this.popConfirm(record)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <a>删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];
    return (
      <div>
        {record.child && Object.keys(record.child).length ? (
          <Table
            size="small"
            columns={column}
            dataSource={record.child}
            pagination={false}
            rowKey={record => record.category}
          />
        ) : null}
        <div style={{ textAlign: 'center', marginTop: 15 }}>
          <Button
            type="dashed"
            onClick={() => this.handleUpdateModalVisibleMenu(true, { diy: '123' }, parents)}
            style={{ width: '40%' }}
          >
            <Icon type="plus" /> Add child
          </Button>
        </div>
      </div>
    );
  };
  render() {
    const { loading } = this.props;
    const { editorValue, editorShow, editorValueMenu, editorShowMenu, allMenu } = this.state;
    // 编辑--分类
    const updateMethods = {
      handleUpdate: this.handleUpdate,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };
    // 编辑--菜单
    const updateMethodsMenu = {
      handleUpdateMenu: this.handleUpdateMenu,
      handleUpdateModalVisibleMenu: this.handleUpdateModalVisibleMenu,
    };
    return (
      <PageHeaderWrapper title="权限管理">
        <Card bordered={false}>
          <Button
            icon="plus"
            onClick={() => this.handleUpdateModalVisible(true, { diy: '123' })}
            type="primary"
            style={{ marginBottom: 15 }}
          >
            新增
          </Button>
          {allMenu && Object.keys(allMenu).length ? (
            <Table
              loading={loading}
              className="components-table-demo-nested"
              columns={this.columns}
              expandedRowRender={this.expandedRowRender}
              dataSource={allMenu}
              rowKey={record => record.gmt_modified}
            />
          ) : null}
        </Card>
        {editorValue && Object.keys(editorValue).length ? (
          <EditorClass editorValue={editorValue} editorShow={editorShow} {...updateMethods} />
        ) : null}
        {editorValueMenu && Object.keys(editorValueMenu).length ? (
          <EditorMenu
            editorValue={editorValueMenu}
            editorShow={editorShowMenu}
            {...updateMethodsMenu}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
