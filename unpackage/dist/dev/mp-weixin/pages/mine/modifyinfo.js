"use strict";
const common_vendor = require("../../common/vendor.js");
const services_cache = require("../../services/cache.js");
const services_api = require("../../services/api.js");
const _sfc_main = {
  data() {
    return {
      // 标记用户是否选择了新头像
      isNewAvatar: false,
      formData: {
        userid: "",
        username: "",
        realname: "",
        phone: "",
        password: "",
        department: "",
        avatarUrl: "/static/logo.png"
      }
    };
  },
  onLoad() {
    this.loadUserInfo();
  },
  methods: {
    loadUserInfo() {
      const userInfo = services_cache.cacheService.getUserInfo();
      if (userInfo) {
        this.formData = {
          userid: userInfo.userid || userInfo.id || "",
          username: userInfo.username || "",
          realname: userInfo.realname || "",
          phone: userInfo.phone || "",
          password: "",
          department: userInfo.department || "",
          avatarUrl: userInfo.avatarUrl || "/static/logo.png"
        };
      }
    },
    chooseAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.formData.avatarUrl = res.tempFilePaths[0];
          this.isNewAvatar = true;
        }
      });
    },
    saveUserInfo() {
      if (!this.formData.username.trim()) {
        common_vendor.index.showToast({
          title: "请输入用户名",
          icon: "none"
        });
        return;
      }
      const userInfo = services_cache.cacheService.getUserInfo() || {};
      const userid = userInfo.userid || userInfo.id;
      common_vendor.index.showLoading({
        title: "保存中..."
      });
      const doUpdateUser = async (avatarUrl) => {
        const userData = {
          userid,
          username: this.formData.username,
          password: this.formData.password,
          realname: this.formData.realname,
          department: this.formData.department,
          phone: this.formData.phone,
          type: userInfo.type || 0,
          useravatar: avatarUrl
        };
        try {
          const res = await services_api.api.userApi.updateUser(userData);
          if (res.status === "success") {
            const updatedUserInfo = {
              ...userInfo,
              ...this.formData,
              userid,
              avatarUrl
            };
            services_cache.cacheService.setUserInfo(updatedUserInfo);
            services_cache.cacheService.setUsername(this.formData.username);
            common_vendor.index.showToast({
              title: "更新成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          } else {
            common_vendor.index.showToast({
              title: res.message || "更新失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/modifyinfo.vue:153", "更新用户信息失败：", error);
          common_vendor.index.showToast({
            title: "网络错误，请重试",
            icon: "none"
          });
        } finally {
          common_vendor.index.hideLoading();
        }
      };
      if (this.isNewAvatar && this.formData.avatarUrl) {
        common_vendor.index.__f__("log", "at pages/mine/modifyinfo.vue:166", "avatarUrl");
        services_api.api.wrenchApi.uploadImage(this.formData.avatarUrl).then((uploadRes) => {
          const avatarUrl = uploadRes.imageUrl || "";
          common_vendor.index.__f__("log", "at pages/mine/modifyinfo.vue:172", "头像上传成功，URL：", avatarUrl);
          if (avatarUrl) {
            doUpdateUser(avatarUrl);
          } else {
            common_vendor.index.showToast({
              title: "头像上传失败，未获取到URL",
              icon: "none"
            });
            common_vendor.index.hideLoading();
          }
        }).catch((err) => {
          common_vendor.index.__f__("error", "at pages/mine/modifyinfo.vue:184", "头像上传失败：", err);
          common_vendor.index.showToast({
            title: "头像上传失败",
            icon: "none"
          });
          common_vendor.index.hideLoading();
        });
      } else {
        doUpdateUser(this.formData.avatarUrl);
      }
    },
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.formData.avatarUrl,
    b: common_vendor.o((...args) => $options.chooseAvatar && $options.chooseAvatar(...args)),
    c: $data.formData.username,
    d: common_vendor.o(($event) => $data.formData.username = $event.detail.value),
    e: $data.formData.phone,
    f: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    g: $data.formData.realname,
    h: common_vendor.o(($event) => $data.formData.realname = $event.detail.value),
    i: $data.formData.department,
    j: common_vendor.o(($event) => $data.formData.department = $event.detail.value),
    k: common_vendor.o((...args) => $options.saveUserInfo && $options.saveUserInfo(...args)),
    l: common_vendor.o((...args) => $options.goBack && $options.goBack(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/modifyinfo.js.map
