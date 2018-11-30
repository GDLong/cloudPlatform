import {
  getBmsList,
  postBmsUpdate,
  postBmsDelete,
  postBmsCreate,
  postBmsHistory,
  postBmsRealTimeBatteryData,
  getDeviceDetail,
  queryLocationInfo,
  postCommandInfo,
  postCommandFreeInfo,
} from '@/services/api';

export default {
  namespace: 'bms',

  state: {
    bmsList: [],
    bmsHistory: [],
  },

  effects: {
    *fetchBmsList({ payload, callback }, { call, put }) {
      const response = yield call(getBmsList, payload);
      if (callback) callback(response);
      yield put({
        type: 'queryBmsList',
        payload: response,
      });
    },
    *fetchBmsUpdate({ payload, callback }, { call, put }) {
      const response = yield call(postBmsUpdate, payload);
      if (callback) callback(response);
    },
    *fetchBmsDelete({ payload, callback }, { call, put }) {
      const response = yield call(postBmsDelete, payload);
      if (callback) callback(response);
    },
    *fetchBmsCreate({ payload, callback }, { call, put }) {
      const response = yield call(postBmsCreate, payload);
      if (callback) callback(response);
    },
    *fetchBmsHistory({ payload, callback }, { call, put }) {
      const response = yield call(postBmsHistory, payload);
      if (callback) callback(response);
    },
    *fetchBmsRealTimeBatteryData({ payload, callback }, { call, put }) {
      const response = yield call(postBmsRealTimeBatteryData, payload);
      if (callback) callback(response);
    },
    *fetchBmsDeviceDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDeviceDetail, payload);
      if (callback) callback(response);
    },
    *fetchBmsDeviceLocation({ payload, callback }, { call, put }) {
      const response = yield call(queryLocationInfo, payload);
      if (callback) callback(response);
    },
    *fetchBmsDeviceCommand({ payload, callback }, { call, put }) {
      const response = yield call(postCommandInfo, payload);
      if (callback) callback(response);
    },
    *fetchBmsDeviceCommandFree({ payload, callback }, { call, put }) {
      const response = yield call(postCommandFreeInfo, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    queryBmsList(state, action) {
      return {
        ...state,
        bmsList: action.payload,
      };
    },
    queryBmsHistory(state, action) {
      return {
        ...state,
        bmsHistory: action.payload,
      };
    },
  },
};
