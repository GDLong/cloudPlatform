import { queryMenu, queryAllMenu } from '@/services/api';
import { routerRedux } from 'dva/router';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'menuTree',
  state: {
    menuData: [],
    userInfo: {},
  },
  effects: {
    *getMenu({ payload, callback }, { call, put }) {
      //local
      const response = yield call(queryMenu);
      if (callback) callback(response);
      if (response.code === '000000') {
        yield put({
          type: 'menuResult',
          payload: response,
        });
      }
    },
    *getAllMenu({ callback }, { call, put }) {
      //server
      const response = yield call(queryAllMenu);
      if (callback) callback(response);
      if (response.code == '000000') {
        yield put({
          type: 'menuResult',
          payload: response,
        });
      }
      if (response.code == '999002') {
        reloadAuthorized();
        yield put(
          routerRedux.push({
            pathname: '/user/login',
          })
        );
      }
    },
  },
  reducers: {
    menuResult(state, action) {
      const exception = [
        {
          path: '/exception',
          routes: [
            {
              path: '/exception/welcome',
              name: 'not-permission',
              component: './Exception/hello',
            },
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
      ];
      const data = action.payload.menus.concat(exception);
      return {
        ...state,
        menuData: data,
        userInfo: action.payload.userInfo,
      };
    },
  },
};
