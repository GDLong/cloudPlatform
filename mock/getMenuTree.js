export default {
  'GET /api/getMenuTree': [
    // 系统设置
    {
      name: '系统设置',
      icon: 'appstore',
      path: '/systemSetting',
      routes: [
        {
          path: '/systemSetting/accountMenage',
          name: '账号管理',
          component: './SystemSetting/accountMenage/accountMenage',
        },
        {
          // authority: ['guest'],
          path: '/systemSetting/roleManage',
          name: '角色管理',
          component: './SystemSetting/roleManage/roleManage',
        },
        {
          path: '/systemSetting/funcConfig',
          name: '权限管理',
          component: './SystemSetting/funcConfig/funcConfig',
        },
        {
          path: '/systemSetting/operationLog',
          name: '操作日志',
          component: './SystemSetting/operationLog/operationLog',
        },
      ],
    },
    // AppManage
    // {
    //     name: "应用管理",
    //     icon: 'appstore',
    //     path: '/appmanage',
    //     routes: [
    //         {
    //             path: '/appmanage/applist',
    //             name: '应用列表',
    //             component: './AppManage/AppList',
    //         }
    //     ]
    // },
    // BMS
    {
      name: 'BMS设备管理',
      icon: 'appstore',
      path: '/equimanage',
      routes: [
        {
          path: '/equimanage/equilist',
          name: '设备列表',
          component: './EquiManage/EquiList',
        },
      ],
    },
    // OBD
    {
      name: '设备管理',
      icon: 'appstore',
      path: '/obdmanage',
      routes: [
        {
          path: '/obdmanage/obdlist',
          name: '终端管理',
          component: './ObdManage/carManage/ObdList',
        },
        {
          path: '/obdmanage/simManage',
          name: 'SIM卡管理',
          component: './ObdManage/simManage/simManage',
        },
      ],
    },
    // 报警
    {
      name: '报警管理',
      icon: 'appstore',
      path: '/alarmManage',
      routes: [
        {
          path: '/alarmManage/alarmQuery',
          name: '报警查询',
          component: './alarmManage/alarmQuery/alarmQuery',
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
    {
      component: '404',
    },
  ],
};
