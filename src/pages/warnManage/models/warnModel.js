import { queryVehicleList, queryAlarmData } from '@/services/api';

export default {
  namespace: 'warning',
  state: {
    warningLists: [],
    warningListDetails: [],
  },

  effects: {
    *fetchWarningList({ payload, callback }, { call, put }) {
      const response = yield call(queryVehicleList, payload);
      if (callback) callback(response);
      yield put({
        type: 'warningLists',
        payload: response,
      });
    },
    *fetchWarningListDetails({ payload, callback }, { call, put }) {
      const response = yield call(queryAlarmData, payload);
      if (callback) callback(response);
      yield put({
        type: 'warningListDetails',
        payload: response,
      });
    },
  },

  reducers: {
    warningLists(state, action) {
      return {
        ...state,
        warningLists: action.payload,
      };
    },
    warningListDetails(state, action) {
      return {
        ...state,
        warningListDetails: action.payload,
      };
    },
  },
};
