import { queryMenu } from '@/services/api';

export default {
  namespace: 'menuTree',
  state: {
    menuData: [],
  },
  effects: {
    *getMenu({ payload, callback }, { call, put }) {
      const response = yield call(queryMenu);
      if (callback) callback(response);
      yield put({
        type: 'menuResult',
        payload: response,
      });
    },
  },
  reducers: {
    menuResult(state, action) {
      return {
        ...state,
        menuData: action.payload,
      };
    },
  },
};
