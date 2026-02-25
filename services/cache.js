// 本地缓存服务
const CACHE_KEYS = {
  IS_LOGGED_IN: 'isLoggedIn',
  USERNAME: 'username',
  USER_INFO: 'userInfo'
};

// 缓存服务
const cacheService = {
  // 保存登录状态
  setLoginStatus: (isLoggedIn) => {
    uni.setStorageSync(CACHE_KEYS.IS_LOGGED_IN, isLoggedIn);
  },

  // 获取登录状态
  getLoginStatus: () => {
    return uni.getStorageSync(CACHE_KEYS.IS_LOGGED_IN) || false;
  },

  // 保存用户名
  setUsername: (username) => {
    uni.setStorageSync(CACHE_KEYS.USERNAME, username);
  },

  // 获取用户名
  getUsername: () => {
    return uni.getStorageSync(CACHE_KEYS.USERNAME) || '';
  },

  // 保存用户信息
  setUserInfo: (userInfo) => {
    uni.setStorageSync(CACHE_KEYS.USER_INFO, userInfo);
  },

  // 获取用户信息
  getUserInfo: () => {
    return uni.getStorageSync(CACHE_KEYS.USER_INFO) || null;
  },

  // 清除所有缓存
  clearAll: () => {
    uni.removeStorageSync(CACHE_KEYS.IS_LOGGED_IN);
    uni.removeStorageSync(CACHE_KEYS.USERNAME);
    uni.removeStorageSync(CACHE_KEYS.USER_INFO);
  }
};

// 导出缓存服务
export default cacheService;
