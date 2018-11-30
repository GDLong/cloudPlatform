import { stringify } from 'qs';
import request from '@/utils/request';
const server = 'http://39.104.84.146:8030/';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}
export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}
// gdl--login
export async function accountLogin(params) {
  return request(server + 'user/login', {
    method: 'POST',
    body: params,
  });
}

export async function register(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}
// system
export async function queryAllResource(params) {
  return request(server + 'resource/queryAllResource', {
    method: 'POST',
    body: params,
  });
}
export async function saveResource(params) {
  return request(server + 'resource/saveResource', {
    method: 'POST',
    body: params,
  });
}
export async function updateResource(params) {
  return request(server + 'resource/updateResource', {
    method: 'POST',
    body: params,
  });
}
export async function updateFirstMenu(params) {
  return request(server + 'resource/updateFirstMenu', {
    method: 'POST',
    body: params,
  });
}
export async function deleteResource(params) {
  return request(server + 'resource/deleteResource', {
    method: 'POST',
    body: params,
  });
}
export async function queryALLLog(params) {
  return request(server + 'obd/queryLog', {
    method: 'POST',
    body: params,
  });
}
export async function queryAllRoles(params) {
  return request(server + 'role/queryAllRoles', {
    method: 'POST',
    body: params,
  });
}
export async function updateRole(params) {
  return request(server + 'role/updateRole', {
    method: 'POST',
    body: params,
  });
}
export async function queryResourceByRole(params) {
  return request(server + 'role/queryResourceByRole', {
    method: 'POST',
    body: params,
  });
}
export async function deleteRole(params) {
  return request(server + 'role/deleteRole', {
    method: 'POST',
    body: params,
  });
}
export async function addRole(params) {
  return request(server + 'role/addRole', {
    method: 'POST',
    body: params,
  });
}
export async function queryUser(params) {
  return request(server + 'user/queryUser', {
    method: 'POST',
    body: params,
  });
}
export async function updateUser(params) {
  return request(server + 'user/updateUser', {
    method: 'POST',
    body: params,
  });
}
export async function addUser(params) {
  return request(server + 'user/addUser', {
    method: 'POST',
    body: params,
  });
}
export async function deleteUser(params) {
  return request(server + 'user/deleteUser', {
    method: 'POST',
    body: params,
  });
}
// gdl-Menu
export async function queryMenu() {
  return request('/api/getMenuTree');
}
// gdl---bms
export async function getBmsList(params) {
  return request(server + 'bms/queryDeviceList', {
    method: 'POST',
    body: params,
  });
}
export async function postBmsUpdate(params) {
  return request(server + 'bms/updateDevice', {
    method: 'POST',
    body: params,
  });
}
export async function postBmsDelete(params) {
  return request(server + 'bms/deleteDevice', {
    method: 'POST',
    body: params,
  });
}
export async function postBmsCreate(params) {
  return request(server + 'bms/addDevice', {
    method: 'POST',
    body: params,
  });
}
export async function postBmsHistory(params) {
  return request(server + 'bms/queryBmsData', {
    method: 'POST',
    body: params,
  });
}
export async function postBmsRealTimeBatteryData(params) {
  return request(server + 'bms/queryRealTimeBatteryData', {
    method: 'POST',
    body: params,
  });
}
export async function getDeviceDetail(params) {
  return request(server + 'bms/getDeviceDetailInfo', {
    method: 'POST',
    body: params,
  });
}
export async function queryLocationInfo(params) {
  return request(server + 'bms/queryDeviceLocationInfo', {
    method: 'POST',
    body: params,
  });
}
export async function postCommandInfo(params) {
  return request(server + 'bms/command', {
    method: 'POST',
    body: params,
  });
}
export async function postCommandFreeInfo(params) {
  return request(server + 'bms/commandFree', {
    method: 'POST',
    body: params,
  });
}

// gdl-obd
export async function queryVehicleList(params) {
  return request(server + 'obd/queryVehicleList', {
    method: 'POST',
    body: params,
  });
}
export async function deleteVehicle(params) {
  return request(server + 'obd/deleteVehicle', {
    method: 'POST',
    body: params,
  });
}
export async function AddVehicle(params) {
  return request(server + 'obd/addVehicle', {
    method: 'POST',
    body: params,
  });
}
export async function UpdateVehicle(params) {
  return request(server + 'obd/updateVehicle', {
    method: 'POST',
    body: params,
  });
}
export async function SearchListVehicle(params) {
  return request(server + 'obd/queryObdData', {
    method: 'POST',
    body: params,
  });
}
export async function queryLocationObd(params) {
  return request(server + 'obd/queryObdLocationInfo', {
    method: 'POST',
    body: params,
  });
}
export async function queryAlarmData(params) {
  return request(server + 'obd/queryAlarmData', {
    method: 'POST',
    body: params,
  });
}
export async function querySimCard(params) {
  return request(server + 'simCard/querySimCard', {
    method: 'POST',
    body: params,
  });
}
export async function addSimCard(params) {
  return request(server + 'simCard/addSimCard', {
    method: 'POST',
    body: params,
  });
}
export async function updateSimCard(params) {
  return request(server + 'simCard/updateSimCard', {
    method: 'POST',
    body: params,
  });
}
export async function deleteSimCard(params) {
  return request(server + 'simCard/deleteSimCard', {
    method: 'POST',
    body: params,
  });
}
