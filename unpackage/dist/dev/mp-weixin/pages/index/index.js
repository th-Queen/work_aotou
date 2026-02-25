"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      bannerImages: [
        "/static/image/1.jpg",
        "/static/image/2.jpg",
        "/static/image/4.jpg"
      ]
    };
  },
  methods: {
    openRelease() {
      common_vendor.index.navigateTo({
        url: "/pages/index/release"
      });
    },
    openTechnical() {
      common_vendor.index.navigateTo({
        url: "/pages/index/technical"
      });
    },
    openTorqueWrench() {
      common_vendor.index.navigateTo({
        url: "/pages/index/wrench"
      });
    },
    openBoltStretcher() {
      common_vendor.index.showToast({
        title: "打开液压螺栓拉伸器",
        icon: "none"
      });
    },
    openTask() {
      common_vendor.index.navigateTo({
        url: "/pages/index/task"
      });
    },
    openQuality() {
      common_vendor.index.navigateTo({
        url: "/pages/index/qt"
      });
    },
    openReleasedt() {
      common_vendor.index.navigateTo({
        url: "/pages/index/detail/releasedt"
      });
    },
    openTechnicaldt() {
      common_vendor.index.navigateTo({
        url: "/pages/index/detail/technicaldt"
      });
    },
    openTaskdt() {
      common_vendor.index.navigateTo({
        url: "/pages/index/detail/taskdt"
      });
    },
    openQualitydt() {
      common_vendor.index.navigateTo({
        url: "/pages/index/detail/qtdt"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.openRelease && $options.openRelease(...args)),
    b: common_vendor.o((...args) => $options.openTechnical && $options.openTechnical(...args)),
    c: common_vendor.o((...args) => $options.openTask && $options.openTask(...args)),
    d: common_vendor.o((...args) => $options.openQuality && $options.openQuality(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
