"use strict";
const common_vendor = require("../../common/vendor.js");
const services_api = require("../../services/api.js");
const services_cache = require("../../services/cache.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    handleLogin() {
      if (!this.username.trim()) {
        common_vendor.index.showToast({
          title: "请输入用户名",
          icon: "none"
        });
        return;
      }
      if (!this.password.trim()) {
        common_vendor.index.showToast({
          title: "请输入密码",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "登录中..."
      });
      services_api.api.userApi.login(this.username, this.password).then((res) => {
        common_vendor.index.hideLoading();
        if (res.status === "success") {
          common_vendor.index.__f__("log", "at pages/login/login.vue:86", "res.data:", res.data);
          services_cache.cacheService.setLoginStatus(true);
          services_cache.cacheService.setUsername(this.username);
          services_cache.cacheService.setUserInfo(res.data);
          common_vendor.index.switchTab({
            url: "/pages/index/index"
          });
        } else {
          common_vendor.index.showToast({
            title: res.message || "登录失败",
            icon: "none"
          });
        }
      }).catch((err) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "网络错误，请重试",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/login/login.vue:108", "登录请求失败:", err);
      });
    },
    goToRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/login/register"
      });
    },
    goToRegisterz() {
      common_vendor.index.navigateTo({
        url: "/pages/login/lianxi"
      });
    },
    goToRegisterz2() {
      common_vendor.index.navigateTo({
        url: "/pages/login/ceshi"
      });
    }
  },
  onLoad() {
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: $data.username,
    c: common_vendor.o(($event) => $data.username = $event.detail.value),
    d: $data.password,
    e: common_vendor.o(($event) => $data.password = $event.detail.value),
    f: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    g: common_vendor.o((...args) => $options.goToRegister && $options.goToRegister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
