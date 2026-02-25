"use strict";
const common_vendor = require("../../common/vendor.js");
const services_cache = require("../../services/cache.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      realname: "",
      department: "",
      phone: "",
      avatarUrl: "/static/logo.png"
      // 默认头像
    };
  },
  onLoad() {
    this.loadUserInfoFromCache();
  },
  onShow() {
    const userInfo = services_cache.cacheService.getUserInfo();
    this.username = services_cache.cacheService.getUsername() || "用户";
    if (userInfo) {
      this.realname = userInfo.realname || "";
      this.department = userInfo.department || "";
      this.phone = userInfo.phone || "";
      this.avatarUrl = userInfo.avatarUrl || "/static/logo.png";
    }
  },
  methods: {
    /**
     * 从缓存加载用户信息
     * 解决登录后首次进入页面数据为空的问题
     */
    loadUserInfoFromCache() {
      const userInfo = services_cache.cacheService.getUserInfo();
      this.username = services_cache.cacheService.getUsername() || "用户";
      if (userInfo) {
        this.realname = userInfo.realname || "";
        this.department = userInfo.department || "";
        this.phone = userInfo.phone || "";
        this.avatarUrl = userInfo.avatarUrl || "/static/logo.png";
      }
    },
    handleEditUser() {
      common_vendor.index.navigateTo({
        url: "/pages/mine/modifyinfo"
      });
    },
    handleLogout() {
      services_cache.cacheService.clearAll();
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.avatarUrl,
    b: common_vendor.t($data.username),
    c: common_vendor.t($data.realname),
    d: common_vendor.t($data.department),
    e: common_vendor.t($data.phone),
    f: common_vendor.o((...args) => $options.handleEditUser && $options.handleEditUser(...args)),
    g: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/mine.js.map
