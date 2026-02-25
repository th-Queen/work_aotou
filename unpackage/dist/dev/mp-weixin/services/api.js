"use strict";
const common_vendor = require("../common/vendor.js");
const API_BASE_URL = "http://192.168.31.128:8059";
const request = (url, method = "GET", data = {}) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url,
      method,
      data,
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const userApi = {
  // 用户登录
  login: (username, password) => {
    return request(`${API_BASE_URL}/user/login`, "POST", {
      username,
      password
    });
  },
  // 用户注册
  register: (username, password) => {
    return request(`${API_BASE_URL}/user/register`, "POST", {
      username,
      password
    });
  },
  // 修改用户信息（新增:2.3）
  // userData，包含 useravatar,string类型（头像URL）
  updateUser: (userData) => {
    return request(`${API_BASE_URL}/user/update`, "POST", userData);
  }
};
const releaseApi = {
  // 发布新任务
  createTask: (taskData) => {
    return request(`${API_BASE_URL}/order/save`, "POST", taskData);
  }
};
const taskApi = {
  //显示任务列表
  taskList: ({ userid, ordertype }) => {
    return request(`${API_BASE_URL}/search/searchAllOrders`, "POST", { userid, ordertype });
  },
  // “确认完成”按钮方法
  taskComplete: (orderid) => {
    return request(`${API_BASE_URL}/order/finish`, "POST", orderid);
  }
};
const api = {
  userApi,
  // wrenchApi,
  releaseApi,
  taskApi
};
exports.api = api;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/api.js.map
