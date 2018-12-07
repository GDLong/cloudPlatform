import {
  queryVehicleList,
  deleteVehicle,
  AddVehicle,
  UpdateVehicle,
  SearchListVehicle,
  queryLocationObd,
  queryAlarmData,
  querySimCard,
  addSimCard,
  updateSimCard,
  deleteSimCard,
} from '@/services/api';

export default {
  namespace: 'obd',

  state: {
    obdList: [],
    searchList: [],
    warningList: [],
    simCardList: [],
  },

  effects: {
    *fetchObdList({ payload, callback }, { call, put }) {
      const response = yield call(queryVehicleList, payload);
      if (callback) callback(response);
      yield put({
        type: 'queryObdList',
        payload: response,
      });
    },
    *fetchObdRemove({ payload, callback }, { call, put }) {
      const response = yield call(deleteVehicle, payload);
      if (callback) callback(response);
    },
    *fetchObdAdd({ payload, callback }, { call, put }) {
      const response = yield call(AddVehicle, payload);
      if (callback) callback(response);
    },
    *fetchObdUpdate({ payload, callback }, { call, put }) {
      const response = yield call(UpdateVehicle, payload);
      if (callback) callback(response);
    },
    *fetchObdSearchList({ payload, callback }, { call, put }) {
      const response = yield call(SearchListVehicle, payload);
      if (callback) callback(response);
      yield put({
        type: 'searchObdList',
        payload: response,
      });
    },
    *fetchObdLocation({ payload, callback }, { call, put }) {
      const response = yield call(queryLocationObd, payload);
      if (callback) callback(response);
    },
    *fetchObdWarningList({ payload, callback }, { call, put }) {
      const response = yield call(queryAlarmData, payload);
      if (callback) callback(response);
      yield put({
        type: 'warningObdList',
        payload: response,
      });
    },
    *fetchQuerySimCard({ payload, callback }, { call, put }) {
      const response = yield call(querySimCard, payload);
      if (callback) callback(response);
      yield put({
        type: 'querySimCard',
        payload: response,
      });
    },
    *fetchAddSimCard({ payload, callback }, { call, put }) {
      const response = yield call(addSimCard, payload);
      if (callback) callback(response);
    },
    *fetchUpdateSimCard({ payload, callback }, { call, put }) {
      const response = yield call(updateSimCard, payload);
      if (callback) callback(response);
    },
    *fetchDeleteSimCard({ payload, callback }, { call, put }) {
      const response = yield call(deleteSimCard, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    queryObdList(state, action) {
      return {
        ...state,
        obdList: action.payload,
      };
    },
    searchObdList(state, action) {
      return {
        ...state,
        searchList: action.payload,
      };
    },
    warningObdList(state, action) {
      return {
        ...state,
        warningList: action.payload,
      };
    },
    querySimCard(state, action) {
      return {
        ...state,
        simCardList: action.payload,
      };
    },
  },
};
