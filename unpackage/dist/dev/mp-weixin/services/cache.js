"use strict";
const common_vendor = require("../common/vendor.js");
const CACHE_KEYS = {
  IS_LOGGED_IN: "isLoggedIn",
  USERNAME: "username",
  USER_INFO: "userInfo"
};
const cacheService = {
  // 保存登录状态
  setLoginStatus: (isLoggedIn) => {
    common_vendor.index.setStorageSync(CACHE_KEYS.IS_LOGGED_IN, isLoggedIn);
  },
  // 获取登录状态
  getLoginStatus: () => {
    return common_vendor.index.getStorageSync(CACHE_KEYS.IS_LOGGED_IN) || false;
  },
  // 保存用户名
  setUsername: (username) => {
    common_vendor.index.setStorageSync(CACHE_KEYS.USERNAME, username);
  },
  // 获取用户名
  getUsername: () => {
    return common_vendor.index.getStorageSync(CACHE_KEYS.USERNAME) || "";
  },
  // 保存用户信息
  setUserInfo: (userInfo) => {
    common_vendor.index.setStorageSync(CACHE_KEYS.USER_INFO, userInfo);
  },
  // 获取用户信息
  getUserInfo: () => {
    return common_vendor.index.getStorageSync(CACHE_KEYS.USER_INFO) || null;
  },
  // 清除所有缓存
  clearAll: () => {
    common_vendor.index.removeStorageSync(CACHE_KEYS.IS_LOGGED_IN);
    common_vendor.index.removeStorageSync(CACHE_KEYS.USERNAME);
    common_vendor.index.removeStorageSync(CACHE_KEYS.USER_INFO);
  }
};
exports.cacheService = cacheService;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/cache.js.map
