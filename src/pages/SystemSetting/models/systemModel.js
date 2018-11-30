import {
  queryAllResource,
  saveResource,
  updateFirstMenu,
  updateResource,
  deleteResource,
  queryALLLog,
  queryAllRoles,
  updateRole,
  queryResourceByRole,
  deleteRole,
  addRole,
  queryUser,
  updateUser,
  addUser,
  deleteUser,
} from '@/services/api';

export default {
  namespace: 'system',

  state: {
    allResource: {},
    queryLog: {},
    queryAllRoles: {},
    AllUser: {},
  },

  effects: {
    *fetchAllResource({ payload, callback }, { call, put }) {
      const response = yield call(queryAllResource, payload);
      if (callback) callback(response);
      yield put({
        type: 'mutationAllResource',
        payload: response,
      });
    },
    *fetchSaveResource({ payload, callback }, { call, put }) {
      const response = yield call(saveResource, payload);
      if (callback) callback(response);
    },
    *fetchUpdateResource({ payload, callback }, { call, put }) {
      const response = yield call(updateResource, payload);
      if (callback) callback(response);
    },
    *fetchUpdateFirstMenu({ payload, callback }, { call, put }) {
      const response = yield call(updateFirstMenu, payload);
      if (callback) callback(response);
    },
    *fetchDeleteResource({ payload, callback }, { call, put }) {
      const response = yield call(deleteResource, payload);
      if (callback) callback(response);
    },
    *fetchQueryLog({ payload, callback }, { call, put }) {
      const response = yield call(queryALLLog, payload);
      if (callback) callback(response);
      yield put({
        type: 'mutationQueryLog',
        payload: response,
      });
    },
    *fetchQueryAllRoles({ payload, callback }, { call, put }) {
      const response = yield call(queryAllRoles, payload);
      if (callback) callback(response);
      yield put({
        type: 'mutationQueryAllRoles',
        payload: response,
      });
    },
    *fetchUpdateRoles({ payload, callback }, { call, put }) {
      const response = yield call(updateRole, payload);
      if (callback) callback(response);
    },
    *fetchQueryResourceByRole({ payload, callback }, { call, put }) {
      const response = yield call(queryResourceByRole, payload);
      if (callback) callback(response);
    },
    *fetchDeleteRole({ payload, callback }, { call, put }) {
      const response = yield call(deleteRole, payload);
      if (callback) callback(response);
    },
    *fetchAddRole({ payload, callback }, { call, put }) {
      const response = yield call(addRole, payload);
      if (callback) callback(response);
    },
    *fetchQueryUser({ payload, callback }, { call, put }) {
      const response = yield call(queryUser, payload);
      if (callback) callback(response);
      yield put({
        type: 'mutationQueryUser',
        payload: response,
      });
    },
    *fetchUpdateUser({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, payload);
      if (callback) callback(response);
    },
    *fetchAddUser({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
      if (callback) callback(response);
    },
    *fetchDeleteUser({ payload, callback }, { call, put }) {
      const response = yield call(deleteUser, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    mutationAllResource(state, action) {
      return {
        ...state,
        allResource: action.payload,
      };
    },
    mutationQueryLog(state, action) {
      return {
        ...state,
        queryLog: action.payload,
      };
    },
    mutationQueryAllRoles(state, action) {
      return {
        ...state,
        queryAllRoles: action.payload,
      };
    },
    mutationQueryUser(state, action) {
      return {
        ...state,
        AllUser: action.payload,
      };
    },
  },
};
