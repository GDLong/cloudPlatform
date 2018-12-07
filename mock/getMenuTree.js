export default {
  'GET /api/getMenuTree': {
    code: '000000',
    menus: [
      // 系统设置
      {
        name: '系统设置',
        icon: 'appstore',
        path: '/systemSetting',
        routes: [
          {
            path: '/systemSetting/accountMenage',
            name: '账号管理',
            component: './systemSetting/accountMenage/accountMenage',
          },
          {
            // authority: ['guest'],
            path: '/systemSetting/roleManage',
            name: '角色管理',
            component: './systemSetting/roleManage/roleManage',
          },
          {
            path: '/systemSetting/funcConfig',
            name: '权限管理',
            component: './systemSetting/funcConfig/funcConfig',
          },
          {
            path: '/systemSetting/operationLog',
            name: '操作日志',
            component: './systemSetting/operationLog/operationLog',
          },
        ],
      },
      // AppManage
      {
        name: '应用管理',
        icon: 'appstore',
        path: '/appManage',
        routes: [
          {
            path: '/appManage/appList',
            name: '应用列表',
            component: './appManage/appList/appList',
          },
        ],
      },
      // BMS
      {
        name: 'BMS设备管理',
        icon: 'appstore',
        path: '/equiManage',
        routes: [
          {
            path: '/equiManage/equiList',
            name: '设备列表',
            component: './equiManage/equiList/equiList',
          },
        ],
      },
      // OBD
      {
        name: '设备管理',
        icon: 'appstore',
        path: '/obdManage',
        routes: [
          {
            path: '/obdManage/terminalManage',
            name: '终端管理',
            component: './obdManage/terminalManage/terminalManage',
          },
          {
            path: '/obdManage/simManage',
            name: 'SIM卡管理',
            component: './obdManage/simManage/simManage',
          },
        ],
      },
      // 报警
      {
        name: '报警管理',
        icon: 'appstore',
        path: '/warnManage',
        routes: [
          {
            path: '/warnManage/warnList',
            name: '报警查询',
            component: './warnManage/warnList/warnList',
          },
        ],
      },
      {
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
    ],
  },
};
